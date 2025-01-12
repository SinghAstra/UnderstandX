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
// Input: { githubUrl: string }
// Output: { repositoryId: string, status: RepositoryStatus }

/**
 * High-level workflow:
 * 1. Authenticate user
 * 2. Validate input
 * 3. Check for existing repository
 * 4. Create/Update repository
 * 5. Start background processing
 * 6. Return immediate response
 */

/**
 * Input validation:
 * 1. Validate GitHub URL format:
 *    - Must be valid GitHub URL
 *    - Must contain owner and repo name
 *    - Return 400 if invalid URL
 *
 * 2. Fetch basic repo details from GitHub API:
 *    - Check if repository exists on GitHub API
 *    - Check if repository is accessible
 *    - Return 404 if repo not found
 *    - Return 403 if repo not accessible
 */

/**
 * Existing repository checks:
 * 1. Look up repository by GitHub ID and user ID
 *
 * 2. If repository exists:
 *    a. If status is PENDING:
 *       - Update repository with new URL if changed
 *       - Continue with processing
 *
 *    b. If status is in progress (FETCHING_GITHUB_REPO_FILES, CHUNKING_FILES, EMBEDDING_CHUNKS):
 *       - Return existing repository ID and current status
 *       - Don't start new processing
 *       - User should use SSE endpoint to continue monitoring
 *
 *    c. If status is SUCCESS:
 *       - return existing repository data
 *
 *    d. If status is FAILED or CANCELED:
 *       - Reset status to PENDING
 *       - Update repository data
 *       - Start new processing
 */

/**
 * Background processing:
 * 1. Start processing in background (don't await)
 * 2. Handle errors in background process
 * 3. Update status throughout processing
 */

/**
 * Response handling:
 * 1. Success response (200):
 *    {
 *      repositoryId: string
 *      status: RepositoryStatus
 *      statusMessage: string
 *      progress: number
 *    }
 *
 * 2. Error responses:
 *    - 400: Invalid input (bad URL)
 *    - 401: Unauthorized
 *    - 403: Repository not accessible
 *    - 404: Repository not found
 *    - 500: Server error
 */

/**
 * Rate limiting considerations:
 * 1. Implement rate limiting per user
 * 2. Consider GitHub API rate limits
 * 3. Add delay between successive requests
 */

/**
 * Edge cases to handle: (In Future)
 * 1. Very large repositories
 */

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

    // 3. Fetch GitHub repo files
    const repoData = await fetchGitHubRepoData(repository.url, false);
    console.log("repoData is ", repoData.files.length);

    // 4. Update Status to indicate chunking files
    await updateRepositoryStatus(repositoryId, "CHUNKING_FILES");

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

    // 4. Update Status to indicate embedding generation
    await updateRepositoryStatus(repositoryId, "EMBEDDING_CHUNKS");

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

    // 9. Update repository status to success
    await updateRepositoryStatus(repositoryId, "SUCCESS");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    } else {
      console.log("Background processing error:", error);
    }
    await updateRepositoryStatus(repositoryId, "FAILED");
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
