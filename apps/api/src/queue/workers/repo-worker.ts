import { Job } from "bullmq";
import fs from "fs-extra";
import path from "path";
import simpleGit from "simple-git";
import { analyzeCodebase } from "../logic/analyzer";
import { reportStatus } from "../logic/reporter";
import { resolveDependencies } from "../logic/resolver";
import { scanDirectory } from "../logic/walker";

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
      "Clone successful. Mapping structure...",
      "PROCESSING"
    );

    await scanDirectory(workDir, repoId, null, workDir);

    await reportStatus(
      repoId,
      "Skeleton built. Starting deep code analysis...",
      "PROCESSING"
    );

    await analyzeCodebase(repoId);
    await resolveDependencies(repoId, workDir);

    await reportStatus(
      repoId,
      "System fully mapped and resolved.",
      "COMPLETED"
    );

    return { workDir };
  } catch (err: any) {
    await reportStatus(repoId, `Error: ${err.message}`, "FAILED");
    console.error(`[GIT ERROR]: ${err.message}`);
    throw err;
  }
}
