import { JobMetadata } from "@/types/jobs";
import PgBoss from "pg-boss";
import { batchGenerateEmbeddings } from "../utils/gemini";
import { fetchGitHubRepoData } from "../utils/github";
import { prisma } from "../utils/prisma";
import { processFilesIntoChunks } from "../utils/repository";
import { getPgBoss } from "./pg-boss";

export const JOB_NAMES = {
  PROCESS_REPOSITORY: "process-repository",
  GENERATE_CHUNKS: "generate-chunks",
  GENERATE_EMBEDDINGS: "generate-embeddings",
};

// Start the job queue
export async function initializeJobQueue() {
  const pgBoss = await getPgBoss();

  pgBoss.work<JobMetadata>(
    JOB_NAMES.PROCESS_REPOSITORY,
    async (jobs) => await Promise.all(jobs.map(processRepositoryHandler))
  );
  pgBoss.work<JobMetadata>(
    JOB_NAMES.GENERATE_CHUNKS,
    async (jobs) => await Promise.all(jobs.map(generateChunksHandler))
  );
  pgBoss.work<JobMetadata>(
    JOB_NAMES.GENERATE_EMBEDDINGS,
    async (jobs) => await Promise.all(jobs.map(generateEmbeddingsHandler))
  );
}

// Job Handlers
async function processRepositoryHandler(job: PgBoss.Job<JobMetadata>) {
  const { repositoryId, githubUrl, isPrivate } = job.data;

  try {
    // 1. Fetch repository data from GitHub API
    const repoData = await fetchGitHubRepoData(githubUrl, isPrivate);

    if (!repoData.success) {
      await updateJobError(repositoryId, "REPO_FETCH");
      return { success: false };
    }

    // 2. Queue the chunk generation job
    const pgBoss = await getPgBoss();
    await pgBoss.send(JOB_NAMES.GENERATE_CHUNKS, {
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
  }
}

async function generateChunksHandler(job: PgBoss.Job<JobMetadata>) {
  const { repositoryId, repoData } = job.data;

  try {
    // Use the repoData passed from the previous job
    if (!repoData) {
      throw new Error("Repository data not provided from previous job");
    }

    // 1. Process files and generate chunks
    const chunks = await processFilesIntoChunks(repoData);

    // 2. Store chunks in database using Prisma
    await prisma.repositoryChunk.createMany({
      data: chunks.map((chunk) => ({
        repositoryId,
        content: chunk.content,
        type: chunk.type,
        filepath: chunk.filepath,
        keywords: chunk.keywords,
      })),
    });

    // 3. Queue embedding generation job
    const pgBoss = await getPgBoss();
    await pgBoss.send(JOB_NAMES.GENERATE_EMBEDDINGS, {
      repositoryId,
    });

    return { success: true };
  } catch (error) {
    await updateJobError(repositoryId, "CHUNK_GENERATION");
    console.log("error --generateChunksHandler");
    console.log("error is ", error);
  }
}

async function generateEmbeddingsHandler(job: PgBoss.Job<JobMetadata>) {
  const { repositoryId } = job.data;
  const BATCH_SIZE = 5;

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

    if (!chunks.length) {
      console.log("No chunks found without embeddings");
      return { success: true };
    }

    const chunkTexts = chunks.map((chunk) => chunk.content);
    const embeddingResults = await batchGenerateEmbeddings(
      chunkTexts,
      BATCH_SIZE
    );

    // 3. Update chunks with embeddings
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

    // Filter out null values and execute updates
    const validUpdates = updates.filter(Boolean);
    await Promise.all(validUpdates);

    // 4. Check if all embeddings were generated successfully
    const remainingChunks = await prisma.repositoryChunk.count({
      where: {
        repositoryId,
        embeddings: {
          equals: [],
        },
      },
    });

    // 5. Update repository status if all chunks are processed
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
  }
}

async function updateJobError(repositoryId: string, stage: string) {
  await prisma.repository.delete({
    where: { id: repositoryId },
  });
  console.log(`Error in ${stage} --updateJobError.`);
}
