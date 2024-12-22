"use server";

import { JobMetadata } from "@/types/jobs";
import PgBoss from "pg-boss";
import { batchGenerateEmbeddings } from "../utils/gemini";
import { fetchGitHubRepoData } from "../utils/github";
import { prisma } from "../utils/prisma";
import { processFilesIntoChunks } from "../utils/repository";
import { getPgBoss } from "./pg-boss";

const JOB_NAMES = {
  PROCESS_REPOSITORY: "process-repository",
  GENERATE_CHUNKS: "generate-chunks",
  GENERATE_EMBEDDINGS: "generate-embeddings",
} as const;

// Start the job queue
export async function initializeJobQueue() {
  console.log("Inside initialize job queue");
  const pgBoss = await getPgBoss();

  try {
    // Add monitoring for job states
    pgBoss.on("error", (error) => console.error("pg-boss error:", error));

    console.log("Setting up process-repository handler...");
    pgBoss.work<JobMetadata>(
      JOB_NAMES.PROCESS_REPOSITORY,
      // Explicitly type the handler to match WorkHandler<JobMetadata>
      async (job) => {
        console.log("Received process-repository job:", job.id);
        const result = await processRepositoryHandler(job);
        return result || { success: false };
      }
    );

    pgBoss.work<JobMetadata>(JOB_NAMES.GENERATE_CHUNKS, async (job) => {
      console.log("Received generate-chunks job:", job.id);
      const result = await generateChunksHandler(job);
      return result || { success: false };
    });

    pgBoss.work<JobMetadata>(JOB_NAMES.GENERATE_EMBEDDINGS, async (job) => {
      console.log("Received generate-embeddings job:", job.id);
      const result = await generateEmbeddingsHandler(job);
      return result || { success: false };
    });
  } catch (error) {
    console.error("Error setting up job queue:", error);
    throw error;
  }
}

// Job Handlers with proper return types
async function processRepositoryHandler(
  job: PgBoss.Job<JobMetadata>
): Promise<{ success: boolean }> {
  console.log("Inside Process Repository Handler.");
  const { repositoryId, githubUrl, isPrivate } = job.data;

  try {
    const repoData = await fetchGitHubRepoData(githubUrl, isPrivate);

    if (!repoData.success) {
      await updateJobError(repositoryId, "REPO_FETCH");
      return { success: false };
    }

    const boss = await getPgBoss();
    await boss.send(JOB_NAMES.GENERATE_CHUNKS, {
      repositoryId,
      githubUrl,
      isPrivate,
      repoData,
    });

    return { success: true };
  } catch (error) {
    await updateJobError(repositoryId, "REPO_PROCESSING");
    console.log("error --processRepositoryHandler");
    console.log("error is ", error);
    return { success: false };
  }
}

async function generateChunksHandler(
  job: PgBoss.Job<JobMetadata>
): Promise<{ success: boolean }> {
  const { repositoryId, repoData } = job.data;

  try {
    if (!repoData) {
      throw new Error("Repository data not provided from previous job");
    }

    const chunks = await processFilesIntoChunks(repoData);

    await prisma.repositoryChunk.createMany({
      data: chunks.map((chunk) => ({
        repositoryId,
        content: chunk.content,
        type: chunk.type,
        filepath: chunk.filepath,
        keywords: chunk.keywords,
      })),
    });

    const boss = await getPgBoss();
    await boss.send(JOB_NAMES.GENERATE_EMBEDDINGS, {
      repositoryId,
    });

    return { success: true };
  } catch (error) {
    await updateJobError(repositoryId, "CHUNK_GENERATION");
    console.log("error --generateChunksHandler");
    console.log("error is ", error);
    return { success: false };
  }
}

async function generateEmbeddingsHandler(
  job: PgBoss.Job<JobMetadata>
): Promise<{
  success: boolean;
  processedChunks?: number;
  remainingChunks?: number;
}> {
  const { repositoryId } = job.data;
  const BATCH_SIZE = 5;

  try {
    const chunks = await prisma.repositoryChunk.findMany({
      where: {
        repositoryId,
        embeddings: {
          equals: [],
        },
      },
      select: {
        id: true,
        content: true,
      },
    });

    if (!chunks.length) {
      console.log("No chunks found without embeddings");
      return { success: true, processedChunks: 0, remainingChunks: 0 };
    }

    const chunkTexts = chunks.map((chunk) => chunk.content);
    const embeddingResults = await batchGenerateEmbeddings(
      chunkTexts,
      BATCH_SIZE
    );

    const updates = chunks.map((chunk, index) => {
      const result = embeddingResults[index];

      if (result.error) {
        console.log(
          `Error generating embedding for chunk ${chunk.id}:`,
          result.error
        );
        return null;
      }

      return prisma.repositoryChunk.update({
        where: { id: chunk.id },
        data: { embeddings: result.embeddings },
      });
    });

    const validUpdates = updates.filter(Boolean);
    await Promise.all(validUpdates);

    const remainingChunks = await prisma.repositoryChunk.count({
      where: {
        repositoryId,
        embeddings: {
          equals: [],
        },
      },
    });

    if (remainingChunks === 0) {
      await prisma.repository.update({
        where: { id: repositoryId },
        data: { status: "SUCCESS" },
      });
    } else {
      console.log(`${remainingChunks} chunks still need embeddings`);
    }

    return {
      success: true,
      processedChunks: validUpdates.length,
      remainingChunks,
    };
  } catch (error) {
    await updateJobError(repositoryId, "EMBEDDING_GENERATION");
    console.log("Error in generateEmbeddingsHandler.");
    console.log("error is ", error);
    return { success: false };
  }
}

async function updateJobError(repositoryId: string, stage: string) {
  await prisma.repository.delete({
    where: { id: repositoryId },
  });
  console.log(`Error in ${stage} --updateJobError.`);
}
