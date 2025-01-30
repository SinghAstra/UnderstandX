import { fetchAndSaveRepository } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  // Get the signature from headers
  const signature = req.headers.get("upstash-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 401 }
    );
  }
  console.log("In Post Process Request");

  // Get the raw body
  const body = await req.text();

  // Verify the signature
  const isValid = await receiver.verify({
    body,
    signature,
    url: `${process.env.APP_URL}/api/worker/process-repository`,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { repositoryId, githubUrl } = await JSON.parse(body);

  try {
    const repoData = await fetchAndSaveRepository(githubUrl, repositoryId);

    return NextResponse.json({ status: "SUCCESS" });
  } catch (error) {
    console.error(error);

    // Update status to failed
    await prisma.repository.update({
      where: { id: repositoryId },
      data: { status: "FAILED" },
    });

    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
