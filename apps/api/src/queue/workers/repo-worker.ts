import { redisConnection } from "@/config/redis";
import { prisma, RepositoryStatus } from "@understand-x/database";
import { REDIS_CHANNELS } from "@understand-x/shared";
import { Job } from "bullmq";
import fs from "fs-extra";
import path from "path";
import simpleGit from "simple-git";

export async function processRepo(job: Job) {
  const { repoId, repoUrl } = job.data;
  const workDir = path.join("/tmp", `understandx-${repoId}`);

  // Helper: Database log + Redis Broadcast trigger
  const createLog = async (msg: string, status: RepositoryStatus) => {
    const log = await prisma.log.create({
      data: { repositoryId: repoId, message: msg, status },
    });

    console.log("log is ", log);

    await redisConnection.publish(
      REDIS_CHANNELS.REPO_LOG_PUBLISH,
      JSON.stringify({ repoId, logId: log.id })
    );
  };

  try {
    // Initial State Update
    await prisma.repository.update({
      where: { id: repoId },
      data: { status: RepositoryStatus.PROCESSING },
    });
    await createLog("Initializing workspace...", RepositoryStatus.PROCESSING);

    // Clone Repository
    await fs.ensureDir("/tmp");
    await createLog(
      "Cloning repository (shallow)...",
      RepositoryStatus.PROCESSING
    );

    await simpleGit().clone(repoUrl, workDir, ["--depth", "1"]);

    // 🚀 [PLACEHOLDER] AST Parsing logic will be called here

    await createLog(
      "Codebase successfully ingested.",
      RepositoryStatus.SUCCESS
    );
    await prisma.repository.update({
      where: { id: repoId },
      data: { status: RepositoryStatus.SUCCESS },
    });
  } catch (err: any) {
    await createLog(
      `Critical Failure: ${err.message}`,
      RepositoryStatus.FAILED
    );
    await prisma.repository.update({
      where: { id: repoId },
      data: { status: RepositoryStatus.FAILED },
    });
    throw err; // Allow BullMQ to handle retries if configured
  } finally {
    // Cleanup: Essential for Render's ephemeral disk
    if (await fs.pathExists(workDir)) {
      await fs.remove(workDir);
    }
  }
}
