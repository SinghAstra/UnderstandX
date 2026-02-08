import { pubClient } from "@/config/redis";
import { prisma, RepoStatus } from "@understand-x/database";
import { REDIS_CHANNELS } from "@understand-x/shared";

export async function reportStatus(
  repositoryId: string,
  message: string,
  status: RepoStatus
) {
  console.log(message);
  const log = await prisma.log.create({
    data: {
      repositoryId,
      message,
      status,
    },
  });

  await prisma.repository.update({
    where: { id: repositoryId },
    data: { status },
  });

  await pubClient.publish(
    REDIS_CHANNELS.REPO_LOG_PUBLISH,
    JSON.stringify({ repositoryId, logId: log.id })
  );

  console.log(`[REPORTER]: ${status} - ${message}`);
}
