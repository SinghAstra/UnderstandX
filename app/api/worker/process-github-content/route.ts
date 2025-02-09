import { fetchGithubContent } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
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

  console.log("In --/api/worker/process-github-content");

  // Get the raw body
  const body = await req.text();

  // Verify the signature
  const isValid = await receiver.verify({
    body,
    signature,
    url: `${process.env.APP_URL}/api/worker/process-github-content`,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { owner, repo, repositoryId, path } = JSON.parse(body);

  console.log("owner is ", owner);
  console.log("repo is ", repo);
  console.log("repositoryId is ", repositoryId);
  console.log("path is ", path);

  try {
    const items = await fetchGithubContent(owner, repo, path, repositoryId);
  } catch (error) {
    console.log("Error Occurred in  --/api/worker/process-github-content");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }

    await prisma.repository.update({
      where: { id: repositoryId },
      data: { status: "FAILED" },
    });

    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
