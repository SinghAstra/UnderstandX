import { GitHubContent } from "@/interfaces/github";
import { sendProcessingUpdate } from "@/lib/pusher/send-update";
import { prisma } from "@/lib/utils/prisma";
import { RepositoryStatus } from "@prisma/client";
import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get("upstash-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 401 }
    );
  }

  // Get the raw body
  const body = await req.text();

  // Verify the signature
  const isValid = await receiver.verify({
    body,
    signature,
    url: `${process.env.APP_URL}/api/worker/process-file-batch`,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const {
    batch,
    repositoryId,
    directoryId,
    currentPath,
    batchNumber,
    totalBatches,
  } = JSON.parse(body);

  try {
    // Process files in batch
    await Promise.all(
      batch.map(async (file: GitHubContent) => {
        await prisma.file.create({
          data: {
            path: file.path,
            name: file.name,
            content: file.content || "",
            repositoryId,
            directoryId,
          },
        });
      })
    );

    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.PROCESSING,
      message: `Processed batch ${batchNumber}/${totalBatches} in ${
        currentPath || "root"
      }`,
    });

    return NextResponse.json({ status: "SUCCESS" });
  } catch (error) {
    console.log("Error Occurred in  --/api/worker/process-file-batch");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }

    await prisma.repository.update({
      where: { id: repositoryId },
      data: { status: RepositoryStatus.FAILED },
    });

    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.PROCESSING,
      message: `Failed processing batch ${batchNumber}/${totalBatches} in ${
        currentPath || "root"
      }`,
    });

    return NextResponse.json(
      { error: "Batch processing failed" },
      { status: 500 }
    );
  }
}
