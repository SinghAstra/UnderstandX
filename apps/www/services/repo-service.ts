import { Prisma, prisma } from "@understand-x/database";

export async function getRepoWithMetadata(id: string) {
  const repo = await prisma.repository.findUnique({
    where: { id },
    include: {
      logs: { orderBy: { createdAt: "desc" }, take: 50 },
      _count: { select: { files: true, directories: true } },
    },
  });

  if (!repo) return null;

  const [totalDeps, resolvedDeps] = await Promise.all([
    prisma.dependency.count({ where: { file: { repositoryId: id } } }),
    prisma.dependency.count({
      where: { file: { repositoryId: id }, resolvedFileId: { not: null } },
    }),
  ]);

  return {
    repo,
    audit: {
      total: totalDeps,
      resolved: resolvedDeps,
      score: totalDeps > 0 ? (resolvedDeps / totalDeps) * 100 : 0,
    },
  };
}

export type FullRepoMetadata = NonNullable<
  Prisma.PromiseReturnType<typeof getRepoWithMetadata>
>;
