import { authOptions } from "@/lib/auth/auth-options";
import { batchGenerateEmbeddings } from "@/lib/utils/gemini";
import {
  fetchGitHubRepoData,
  fetchGitHubRepoMetaData,
  parseGithubUrl,
} from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { processFilesIntoChunks } from "@/lib/utils/repository";
import { RepositoryStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Route: POST /api/repository/process
// Purpose: Process a GitHub repository by fetching its contents and generating embeddings

// Case to handle :
// 1. Existing repository check
// 2. API rate limiting
// 3. Large Codebases

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Get and validate input
    const body = await req.json();
    const { githubUrl } = body;

    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL is required" },
        { status: 400 }
      );
    }

    console.log("githubUrl is ", githubUrl);

    // 3. Parse and validate GitHub URL
    const urlInfo = parseGithubUrl(githubUrl);
    if (!urlInfo.isValid || !urlInfo.owner) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    console.log("urlInfo is ", urlInfo);

    // 4. Fetch repository MetaData from GitHub API
    const repoDetails = await fetchGitHubRepoMetaData(
      urlInfo.owner,
      urlInfo.repo
    );

    console.log("Fetched Repo Details");

    // 5. Create new repository record
    const repository = await prisma.repository.create({
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

    console.log("Created new Repository Record");

    processRepositoryInBackground(repository.id);

    // 6. Return immediate response
    return NextResponse.json({
      repositoryId: repository.id,
      status: "PENDING",
      message: "Repository processing started",
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

async function processRepositoryInBackground(repositoryId: string) {
  try {
    // 1. Fetch repository details
    const repository = await prisma.repository.findUnique({
      where: { id: repositoryId },
    });

    // 2. Update status to indicate GitHub repo fetching
    await updateRepositoryStatus(repositoryId, "FETCHING_GITHUB_REPO_FILES");

    if (!repository) {
      throw new Error("Repository not found");
    }

    let repoData;

    try {
      // 3. Fetch GitHub repo files
      repoData = await fetchGitHubRepoData(repository.url, false);
      console.log("repoData is ", repoData.files.length);
    } catch (error) {
      await updateRepositoryStatus(
        repositoryId,
        "FETCHING_GITHUB_REPO_FILES_FAILED"
      );
      throw error;
    }

    // 4. Update Status to indicate chunking files
    await updateRepositoryStatus(repositoryId, "CHUNKING_FILES");

    try {
      // 5. Process files into chunks
      const chunks = await processFilesIntoChunks(repoData.files);

      console.log("chunks.length is ", chunks.length);

      // 6. Save chunks to database
      await prisma.repositoryChunk.createMany({
        data: chunks.map((chunk) => ({
          repositoryId: repository.id,
          content: chunk.content,
          type: chunk.type,
          filepath: chunk.filepath,
          keywords: chunk.keywords,
        })),
      });
    } catch (error) {
      await updateRepositoryStatus(repositoryId, "CHUNKING_FILES_FAILED");
      throw error;
    }

    // 4. Update Status to indicate embedding generation
    await updateRepositoryStatus(repositoryId, "EMBEDDING_CHUNKS");

    try {
      // 8. Generate embeddings for chunks
      const chunksForEmbedding = await prisma.repositoryChunk.findMany({
        where: {
          repositoryId: repository.id,
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
    } catch (error) {
      await updateRepositoryStatus(repositoryId, "EMBEDDING_CHUNKS_FAILED");
      throw error;
    }

    // 9. Update repository status to success
    await updateRepositoryStatus(repositoryId, "SUCCESS");
  } catch (error) {
    console.log("Background processing error.");
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    }
  }
}

async function updateRepositoryStatus(
  repositoryId: string,
  status: RepositoryStatus
) {
  console.log("In update RepositoryStatus status :- ", status);

  await prisma.repository.update({
    where: { id: repositoryId },
    data: { status },
  });
}
