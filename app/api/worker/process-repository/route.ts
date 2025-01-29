import { fetchGitHubRepoData } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { processFilesIntoChunks } from "@/lib/utils/repository";
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
    const repoData = await fetchGitHubRepoData(githubUrl, repositoryId);

    console.log("repoData is ", repoData.files.length);

    // 7. Process files into chunks
    const chunks = await processFilesIntoChunks(repoData.files);

    console.log("chunks.length is ", chunks.length);

    // 8. Save chunks to database
    await prisma.repositoryChunk.createMany({
      data: chunks.map((chunk) => ({
        repositoryId: repositoryId,
        content: chunk.content,
        type: chunk.type,
        filepath: chunk.filepath,
        keywords: chunk.keywords,
      })),
    });

    // 9. Generate embeddings for chunks
    const chunksForEmbedding = await prisma.repositoryChunk.findMany({
      where: {
        repositoryId: repositoryId,
        embeddings: {
          equals: null,
        },
      },
      select: {
        id: true,
        content: true,
      },
    });

    console.log("chunksForEmbedding.length is ", chunksForEmbedding.length);

    const BATCH_SIZE = 5;
    if (chunksForEmbedding.length > 0) {
      const chunkTexts = chunksForEmbedding.map((chunk) => chunk.content);
      console.log("chunkTexts.length is ", chunkTexts.length);

      const embeddingResults = await batchGenerateEmbeddings(
        chunkTexts,
        BATCH_SIZE
      );
      console.log("embeddingResults.length is ", embeddingResults.length);

      //10. Update chunks with embeddings
      await updateChunksWithEmbeddings(chunksForEmbedding, embeddingResults);
      console.log("Repository chunk updates completed");
    }

    //11. Update repository status to success
    await prisma.repository.update({
      where: { id: repositoryId },
      data: { status: "SUCCESS" },
    });

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
