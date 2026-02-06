import { redisConnection } from "@/config/redis";
import { QUEUES } from "@/constants/queues";
import { Queue } from "bullmq";

export const repositoryImportQueue = new Queue(QUEUES.REPO_IMPORT, {
  connection: redisConnection,
});
