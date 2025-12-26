import redisConnection from "@/config/redis";
import { REPOSITORY_IMPORT_QUEUE } from "@/constants/queues";
import { Queue } from "bullmq";

// BullMQ queue for repository imports.
export const repositoryImportQueue = new Queue(REPOSITORY_IMPORT_QUEUE, {
  connection: redisConnection,
});
