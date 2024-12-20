import { JobMetadata } from "@/types/jobs";
import { createClient } from "@supabase/supabase-js";
import PgBoss from "pg-boss";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const pgBoss = new PgBoss(process.env.DATABASE_URL!);

export const JOB_NAMES = {
  PROCESS_REPOSITORY: "process-repository",
  GENERATE_CHUNKS: "generate-chunks",
  GENERATE_EMBEDDINGS: "generate-embeddings",
};

// Start the job queue
export async function initializeJobQueue() {
  await pgBoss.start();

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

    // 2. Update repository status in database
    await supabase
      .from("Repository")
      .update({
        githubId: repoData.id,
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        owner: repoData.owner.login,
        url: repoData.html_url,
        status: "PENDING",
      })
      .eq("id", repositoryId);

    // 3. Queue the chunk generation job
    await pgBoss.send(JOB_NAMES.GENERATE_CHUNKS, {
      repositoryId,
      userId,
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

    // 3. Store chunks in database
    for (const chunk of chunks) {
      await supabase.from("RepositoryChunk").insert({
        repositoryId,
        content: chunk.content,
        type: chunk.type,
        filepath: chunk.filepath,
        keywords: chunk.keywords,
      });
    }

    // 4. Queue embedding generation job
    await pgBoss.send(JOB_NAMES.GENERATE_EMBEDDINGS, {
      repositoryId,
      userId: job.data.userId,
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
    // 1. Fetch all chunks without embeddings
    const { data: chunks } = await supabase
      .from("RepositoryChunk")
      .select("id, content")
      .eq("repositoryId", repositoryId)
      .is("embeddings", null);

    // 2. Generate embeddings for each chunk
    for (const chunk of chunks!) {
      const embedding = await generateEmbedding(chunk.content);

      // 3. Update chunk with embedding
      await supabase
        .from("RepositoryChunk")
        .update({ embeddings: embedding })
        .eq("id", chunk.id);
    }

    // 4. Update repository status to SUCCESS
    await supabase
      .from("Repository")
      .update({ status: "SUCCESS" })
      .eq("id", repositoryId);

    return { success: true };
  } catch (error) {
    await updateJobError(repositoryId, "EMBEDDING_GENERATION", error);
    throw error;
  }
}

async function updateJobError(repositoryId: string, stage: string, error: any) {
  await supabase
    .from("Repository")
    .update({
      status: "ERROR",
      error: `Error in ${stage}: ${error.message}`,
    })
    .eq("id", repositoryId);
}
