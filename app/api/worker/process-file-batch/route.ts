import { GitHubContent } from "@/interfaces/github";
import { sendProcessingUpdate } from "@/lib/pusher/send-update";
import { prisma } from "@/lib/utils/prisma";
import { RepositoryStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  const {
    batch,
    repositoryId,
    directoryId,
    currentPath,
    batchNumber,
    totalBatches,
  } = await req.json();

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

    const endTime = Date.now(); // End time
    console.log(
      `API response time for /api/worker/process-file-batch ${currentPath} : ${
        endTime - startTime
      } seconds`
    );

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
