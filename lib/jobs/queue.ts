import { JobMetadata } from "@/types/jobs";
import { RepositoryChunk } from "@prisma/client";
import PgBoss from "pg-boss";
import { prisma } from "../prisma";
import { getPgBoss } from "./pg-boss";

export const JOB_NAMES = {
  PROCESS_REPOSITORY: "process-repository",
  GENERATE_CHUNKS: "generate-chunks",
  GENERATE_EMBEDDINGS: "generate-embeddings",
};

// Start the job queue
export async function initializeJobQueue() {
  const pgBoss = await getPgBoss();

  // Register job handlers
  pgBoss.work(JOB_NAMES.PROCESS_REPOSITORY, processRepositoryHandler);
  pgBoss.work(JOB_NAMES.GENERATE_CHUNKS, generateChunksHandler);
  pgBoss.work(JOB_NAMES.GENERATE_EMBEDDINGS, generateEmbeddingsHandler);
}

// Job Handlers
async function processRepositoryHandler(job: PgBoss.Job<JobMetadata>) {
  const { repositoryId, userId, githubUrl, isPrivate } = job.data;

  try {
    // 1. Fetch repository data from GitHub API
    const repoData = await fetchGitHubRepoData(githubUrl, isPrivate);

    // 2. Queue the chunk generation job
    const pgBoss = await getPgBoss();
    await pgBoss.send(JOB_NAMES.GENERATE_CHUNKS, {
      repositoryId,
      githubUrl,
      isPrivate,
    });

    return { success: true };
  } catch (error) {
    await updateJobError(repositoryId, "REPO_PROCESSING", error);
    throw error;
  }
}

async function generateChunksHandler(job: PgBoss.Job<JobMetadata>) {
  const { repositoryId, githubUrl, isPrivate } = job.data;

  try {
    // 1. Fetch Data from github api
    const repoData = await fetchGitHubRepoData(githubUrl, isPrivate);

    // 2. Process files and generate chunks
    const chunks = await processFilesIntoChunks(repoData);

    // 3. Store chunks in database using Prisma
    await prisma.repositoryChunk.createMany({
      data: chunks.map((chunk: RepositoryChunk) => ({
        repositoryId,
        content: chunk.content,
        type: chunk.type,
        filepath: chunk.filepath,
        keywords: chunk.keywords,
      })),
    });

    // 4. Queue embedding generation job
    const pgBoss = await getPgBoss();
    await pgBoss.send(JOB_NAMES.GENERATE_EMBEDDINGS, {
      repositoryId,
    });

    return { success: true };
  } catch (error) {
    await updateJobError(repositoryId, "CHUNK_GENERATION", error);
    throw error;
  }
}

async function generateEmbeddingsHandler(job: PgBoss.Job<JobMetadata>) {
  const { repositoryId } = job.data;

  try {
    // 1. Fetch all chunks without embeddings using Prisma
    const chunks = await prisma.repositoryChunk.findMany({
      where: {
        repositoryId,
        embeddings: {
          equals: [], // Empty array instead of null
        },
      },
      select: {
        id: true,
        content: true,
      },
    });

    // 2. Generate embeddings for each chunk
    for (const chunk of chunks!) {
      const embedding = await generateEmbedding(chunk.content);

      // 3. Update chunk with embedding
      await prisma.repositoryChunk.update({
        where: { id: chunk.id },
        data: { embeddings: embedding },
      });
    }

    // 4. Update repository status to SUCCESS
    await prisma.repository.update({
      where: { id: repositoryId },
      data: { status: "SUCCESS" },
    });

    return { success: true };
  } catch (error) {
    await updateJobError(repositoryId, "EMBEDDING_GENERATION", error);
    throw error;
  }
}

async function updateJobError(repositoryId: string, stage: string, error: any) {
  // Delete the repository if any error occurs
  // await prisma.repository.update({
  //   where: { id: repositoryId },
}
