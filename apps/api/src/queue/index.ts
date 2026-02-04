import { redisConnection } from "@/config/redis";
import { QUEUES } from "@/constants/queues";
import { Queue } from "bullmq";

/**
 * BullMQ queue for repository imports.
 * This is used by the API routes to push new jobs.
 */
export const repositoryImportQueue = new Queue(QUEUES.REPO_IMPORT, {
  connection: redisConnection,
});
