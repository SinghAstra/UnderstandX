import { redisConnection } from "@/config/redis";
import { logError } from "@/utils/logger";
import { prisma, RepositoryStatus } from "@understand-x/database";
import { REDIS_CHANNELS } from "@understand-x/shared";
import { Job } from "bullmq";
import fs from "fs-extra";
import path from "path";
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import { analyzeCodebase } from "../logic/analyzer";
import { createLog } from "../logic/helper";
import { resolveDependencies } from "../logic/resolver";
import { walkAndMap } from "../logic/walker";

export async function processRepo(job: Job) {
  const { repoId, repoUrl } = job.data;

  const workDir = path.resolve(process.cwd(), "tmp", `${repoId}`);

  try {
    // Ensure the parent tmp directory exists
    await fs.ensureDir(path.dirname(workDir));

    await prisma.repository.update({
      where: { id: repoId },
      data: { status: RepositoryStatus.PROCESSING },
    });

    await createLog(
      "Workspace initialized. Starting clone...",
      RepositoryStatus.PROCESSING,
      repoId
    );

    // Configure Simple Git with error logging
    const options: Partial<SimpleGitOptions> = {
      baseDir: process.cwd(),
      binary: "git",
      maxConcurrentProcesses: 6,
    };

    const git: SimpleGit = simpleGit(options);

    console.log(`[GIT]: Cloning ${repoUrl} into ${workDir}`);

    // Execution with verbose error catching
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
      RepositoryStatus.PROCESSING,
      repoId
    );

    // This scans the /tmp folder and populates the DB tables
    await walkAndMap(workDir, repoId, workDir);

    const fileCount = await prisma.file.count({
      where: { repositoryId: repoId },
    });
    const dirCount = await prisma.directory.count({
      where: { repositoryId: repoId },
    });

    await createLog(
      `Mapped ${fileCount} files in ${dirCount} directories.`,
      RepositoryStatus.PROCESSING,
      repoId
    );

    // Extract Metadata (AST)
    await createLog(
      "Extracting code symbols (AST)...",
      RepositoryStatus.PROCESSING,
      repoId
    );
    await analyzeCodebase(workDir, repoId);

    //  Dependency Mapping
    await createLog(
      `Analyzed ${fileCount} files. Building graph...`,
      RepositoryStatus.PROCESSING,
      repoId
    );

    await createLog(
      "Connecting dependency graph...",
      RepositoryStatus.PROCESSING,
      repoId
    );
    await resolveDependencies(repoId, workDir);

    // Finalize
    const resolvedCount = await prisma.dependency.count({
      where: { file: { repositoryId: repoId }, NOT: { resolvedFileId: null } },
    });

    await createLog(
      `Nervous system built. Linked ${resolvedCount} dependencies.`,
      RepositoryStatus.SUCCESS,
      repoId
    );

    await createLog("Analysis complete.", RepositoryStatus.SUCCESS, repoId);

    await prisma.repository.update({
      where: { id: repoId },
      data: { status: RepositoryStatus.SUCCESS },
    });
  } catch (err) {
    logError(err);

    await createLog(
      `Something went wrong on the server. Please try again later.`,
      RepositoryStatus.FAILED,
      repoId
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
