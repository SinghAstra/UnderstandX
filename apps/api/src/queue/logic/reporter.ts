import { pubClient } from "@/config/redis";
import { prisma, RepositoryStatus } from "@understand-x/database";
import { REDIS_CHANNELS } from "@understand-x/shared";

export async function reportStatus(
  repositoryId: string,
  message: string,
  status: RepositoryStatus
) {
  console.log(message);
  // 1. Create the log entry in the Database
  const log = await prisma.log.create({
    data: {
      repositoryId,
      message,
      status,
    },
  });

  // 2. Update the main Repository status
  await prisma.repository.update({
    where: { id: repositoryId },
    data: { status },
  });

  // 3. Publish to Redis to trigger the WebSocket broadcast
  await pubClient.publish(
    REDIS_CHANNELS.REPO_LOG_PUBLISH,
    JSON.stringify({ repositoryId, logId: log.id })
  );

  console.log(`[REPORTER]: ${status} - ${message}`);
}
