import { redisConnection } from "@/config/redis";
import { prisma, RepositoryStatus } from "@understand-x/database";
import { REDIS_CHANNELS } from "@understand-x/shared";

/**
 * Turns: import { Button } from "@/components/Button"
 * Into: "@/components/Button"
 */
export function extractPathFromImport(text: string): string {
  const match = text.match(/from\s+['"](.+)['"]/);
  return match ? match[1] : "";
}

export const createLog = async (
  msg: string,
  status: RepositoryStatus,
  repoId: string
) => {
  const log = await prisma.log.create({
    data: { repositoryId: repoId, message: msg, status },
  });

  // console.log(`[LOG]: ${msg}`);

  await redisConnection.publish(
    REDIS_CHANNELS.REPO_LOG_PUBLISH,
    JSON.stringify({ repoId, logId: log.id })
  );
};
