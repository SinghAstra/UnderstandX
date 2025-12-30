import { redisConnection } from "@/config/redis";
import { logError } from "@/utils/logger";
import { prisma, RepositoryStatus } from "@understand-x/database";
import { REDIS_CHANNELS } from "@understand-x/shared";
import { Job } from "bullmq";
import fs from "fs-extra";
import path from "path";
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";

export async function processRepo(job: Job) {
  const { repoId, repoUrl } = job.data;

  const workDir = path.resolve(process.cwd(), "tmp", `understandx-${repoId}`);

  const createLog = async (msg: string, status: RepositoryStatus) => {
    const log = await prisma.log.create({
      data: { repositoryId: repoId, message: msg, status },
    });

    // console.log(`[LOG]: ${msg}`);

    await redisConnection.publish(
      REDIS_CHANNELS.REPO_LOG_PUBLISH,
      JSON.stringify({ repoId, logId: log.id })
    );
  };

  try {
    // 1. Ensure the parent tmp directory exists
    await fs.ensureDir(path.dirname(workDir));

    await prisma.repository.update({
      where: { id: repoId },
      data: { status: RepositoryStatus.PROCESSING },
    });

    await createLog(
      "Workspace initialized. Starting clone...",
      RepositoryStatus.PROCESSING
    );

    // 2. Configure Simple Git with error logging
    const options: Partial<SimpleGitOptions> = {
      baseDir: process.cwd(),
      binary: "git",
      maxConcurrentProcesses: 6,
    };

    const git: SimpleGit = simpleGit(options);

    console.log(`[GIT]: Cloning ${repoUrl} into ${workDir}`);

    // 3. Execution with verbose error catching
    await git.clone(repoUrl, workDir, ["--depth", "1"]);

    // VERIFICATION: Check if folder actually exists before continuing
    const exists = await fs.pathExists(workDir);

    if (!exists) {
      throw new Error(
        "Git clone reported success, but directory does not exist."
      );
    }

    const files = await fs.readdir(workDir);

    await createLog(
      `Clone complete. Found ${files.length} top-level items.`,
      RepositoryStatus.PROCESSING
    );

    // 🚀 [PLACEHOLDER] AST Parsing logic goes here

    for (let i = 0; i < 40; i++) {
      await createLog("Analysis complete.", RepositoryStatus.SUCCESS);
    }

    await prisma.repository.update({
      where: { id: repoId },
      data: { status: RepositoryStatus.SUCCESS },
    });
  } catch (err) {
    logError(err);

    await createLog(
      `Something went wrong on the server. Please try again later.`,
      RepositoryStatus.FAILED
    );

    await prisma.repository.update({
      where: { id: repoId },
      data: { status: RepositoryStatus.FAILED },
    });
    throw err;
  } finally {
    /*
    if (await fs.pathExists(workDir)) {
       await fs.remove(workDir);
       console.log(`[CLEANUP]: Removed ${workDir}`);
    }
    */
  }
}
