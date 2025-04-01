import { prisma } from "@/lib/utils/prisma";
import { notFound, redirect } from "next/navigation";
import RepoLogs from "./repo-logs";

export default async function RepoProcessingLogsPage({
  params,
}: {
  params: { id: string };
}) {
  const repositoryId = params.id;

  const repository = await prisma.repository.findUnique({
    where: { id: repositoryId },
  });

  if (!repository) {
    notFound();
  }

  if (repository.status === "SUCCESS") {
    redirect(`/repository/${repositoryId}`);
  }

  return <RepoLogs repository={repository} />;
}
