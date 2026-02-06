import { Job } from "bullmq";
import fs from "fs-extra";
import path from "path";
import simpleGit from "simple-git";
import { reportStatus } from "../logic/reporter";

export async function processRepo(job: Job) {
  const { repoId, repoUrl } = job.data;

  const workDir = path.resolve(process.cwd(), "tmp", `${repoId}`);

  try {
    await reportStatus(repoId, "Initializing workspace...", "PROCESSING");

    await fs.ensureDir(path.dirname(workDir));

    if (await fs.pathExists(workDir)) {
      await fs.remove(workDir);
    }

    await reportStatus(repoId, `Starting clone for: ${repoUrl}`, "PROCESSING");

    const git = simpleGit();
    await git.clone(repoUrl, workDir, ["--depth", "1"]);

    await reportStatus(
      repoId,
      "Clone successful. Preparing for analysis...",
      "PROCESSING"
    );

    return { workDir };
  } catch (err: any) {
    console.error(`[GIT ERROR]: ${err.message}`);
    throw err;
  }
}
