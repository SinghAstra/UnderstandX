import { authOptions } from "@/lib/auth/auth-options";
import { batchGenerateEmbeddings } from "@/lib/utils/gemini";
import {
  fetchGitHubRepoData,
  fetchGitHubRepoDetails,
  parseGithubUrl,
} from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { processFilesIntoChunks } from "@/lib/utils/repository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { githubUrl } = await req.json();

    // 1. Parse and validate GitHub URL
    const urlInfo = parseGithubUrl(githubUrl);
    if (!urlInfo.isValid || !urlInfo.owner) {
      return NextResponse.json({ error: urlInfo.error }, { status: 400 });
    }

    console.log("urlInfo is ", urlInfo);

    // 2. Fetch repository details from GitHub API
    const repoDetails = await fetchGitHubRepoDetails(
      urlInfo.owner,
      urlInfo.repo
    );

    console.log("repoDetails is ", repoDetails);

    console.log("repoDetails.githubId is ", repoDetails.githubId);

    // 3. Check if repository already exists using GitHub ID
    const existingRepo = await prisma.repository.findFirst({
      where: {
        githubId: repoDetails.githubId,
        userId: session.user.id,
      },
    });

    console.log("existingRepo is ", existingRepo);

    if (existingRepo) {
      // Update the URL if it has changed
      if (existingRepo.url !== repoDetails.url) {
        await prisma.repository.update({
          where: { id: existingRepo.id, userId: session.user.id },
          data: {
            url: repoDetails.url,
            name: repoDetails.name,
            fullName: repoDetails.fullName,
          },
        });
      }

      if (existingRepo.url !== repoDetails.avatarUrl) {
        await prisma.repository.update({
          where: { id: existingRepo.id, userId: session.user.id },
          data: {
            avatarUrl: repoDetails.avatarUrl,
          },
        });
      }

      if (existingRepo.status === "PENDING") {
        console.log("Deleted existing repository with status PENDING");
        await prisma.repository.delete({
          where: {
            id: existingRepo.id,
            userId: session.user.id,
          },
        });
      } else {
        return NextResponse.json({
          repositoryId: existingRepo.id,
          status: existingRepo.status,
        });
      }
    }

    // 4. Create new repository record
    const newRepo = await prisma.repository.create({
      data: {
        githubId: repoDetails.githubId,
        name: repoDetails.name,
        fullName: repoDetails.fullName,
        description: repoDetails.description,
        owner: repoDetails.owner,
        url: githubUrl,
        status: "PENDING",
        userId: session.user.id,
        avatarUrl: repoDetails.avatarUrl,
      },
    });

    console.log("newRepo is ", newRepo);

    // 5. Fetch repository details and data
    const repoData = await fetchGitHubRepoData(githubUrl, false);

    console.log("repoData is ", repoData.files.length);

    // 6. Process files into chunks
    const chunks = await processFilesIntoChunks(repoData.files);

    console.log("chunks.length is ", chunks.length);

    // 7. Save chunks to database
    await prisma.repositoryChunk.createMany({
      data: chunks.map((chunk) => ({
        repositoryId: newRepo.id,
        content: chunk.content,
        type: chunk.type,
        filepath: chunk.filepath,
        keywords: chunk.keywords,
      })),
    });

    // 8. Generate embeddings for chunks
    const chunksForEmbedding = await prisma.repositoryChunk.findMany({
      where: {
        repositoryId: newRepo.id,
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

      // Update chunks with embeddings
      await Promise.all(
        chunksForEmbedding.map((chunk, index) => {
          const result = embeddingResults[index];
          if (!result.error) {
            return prisma.repositoryChunk.update({
              where: { id: chunk.id },
              data: { embeddings: result.embeddings },
            });
          }
        })
      );
    }

    // 9. Update repository status to success
    await prisma.repository.update({
      where: { id: newRepo.id },
      data: { status: "SUCCESS" },
    });

    return NextResponse.json({
      repositoryId: newRepo.id,
      status: "SUCCESS",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    } else {
      console.log("Unknown error:", error);
    }
    console.log("error -- get /repository/process");
    return NextResponse.json(
      { error: "Failed to process repository" },
      { status: 500 }
    );
  }
}
