import { redisConnection } from "@/config/redis";
import { QUEUES } from "@/constants/queues";
import { Worker } from "bullmq";
import { processRepo } from "./repo-worker";

const worker = new Worker(QUEUES.REPO_IMPORT, processRepo, {
  connection: redisConnection,
  concurrency: 1,
});

worker.on("active", (job) => {
  console.log(
    `[WORKER]: Job ${job.id} for repo ${job.data.repoId} is now active.`
  );
});

worker.on("completed", (job) => {
  console.log(`[WORKER]: Job ${job.id} completed.`);
});

worker.on("failed", (job, err) => {
  console.error(`[WORKER]: Job ${job?.id} failed: ${err.message}`);
});

console.log(
  `🏃 Worker process is live and listening on: ${QUEUES.REPO_IMPORT}`
);
