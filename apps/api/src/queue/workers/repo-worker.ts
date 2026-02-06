import { Job } from "bullmq";
import fs from "fs-extra";
import path from "path";
import simpleGit from "simple-git";
import { reportStatus } from "../logic/reporter";

export async function processRepo(job: Job) {
  const { repoId, repoUrl } = job.data;

  // 1. Create a local folder name using the Repo ID
  const workDir = path.resolve(process.cwd(), "tmp", `${repoId}`);

  try {
    // Start Processing
    await reportStatus(repoId, "Initializing workspace...", "PROCESSING");

    // 2. Ensure the tmp directory exists
    await fs.ensureDir(path.dirname(workDir));

    // Check if folder exists (cleanup from previous failed attempts)
    if (await fs.pathExists(workDir)) {
      await fs.remove(workDir);
    }

    await reportStatus(repoId, `Starting clone for: ${repoUrl}`, "PROCESSING");

    // 3. Perform a "Shallow Clone" (--depth 1)
    // This only grabs the latest version, which is much faster and saves space.
    const git = simpleGit();
    await git.clone(repoUrl, workDir, ["--depth", "1"]);

    await reportStatus(
      repoId,
      "Clone successful. Preparing for analysis...",
      "PROCESSING"
    );

    // Return the path so the next phase knows where to find the files
    return { workDir };
  } catch (err: any) {
    console.error(`[GIT ERROR]: ${err.message}`);
    throw err; // BullMQ will mark the job as 'failed'
  }
}
