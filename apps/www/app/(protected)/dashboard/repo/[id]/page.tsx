import { prisma } from "@understand-x/database";
import { notFound } from "next/navigation";
import RepoClientPage from "./repo-client-page";

interface Props {
  params: { id: string };
}

// Should server action like getRepoData not be in separate file like what should be folder structure ?
async function getRepoData(id: string) {
  const repo = await prisma.repository.findUnique({
    where: { id },
    include: {
      logs: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      _count: {
        select: {
          files: true,
          directories: true,
        },
      },
    },
  });

  if (!repo) return null;

  const totalDeps = await prisma.dependency.count({
    where: { file: { repositoryId: id } },
  });
  const resolvedDeps = await prisma.dependency.count({
    where: {
      file: { repositoryId: id },
      resolvedFileId: { not: null },
    },
  });

  return {
    repo,
    audit: {
      total: totalDeps,
      resolved: resolvedDeps,
      score: totalDeps > 0 ? (resolvedDeps / totalDeps) * 100 : 0,
    },
  };
}

export default async function Page({ params }: Props) {
  const data = await getRepoData(params.id);

  if (!data) {
    notFound();
  }

  return (
    <RepoClientPage
      repoId={params.id}
      initialData={data.repo}
      audit={data.audit}
    />
  );
}
