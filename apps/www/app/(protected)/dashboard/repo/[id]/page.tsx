import { getRepoWithMetadata } from "@/services/repo-service";
import { notFound } from "next/navigation";
import RepoClientPage from "./repo-client-page";

interface RepoPageProps {
  params: Promise<{ id: string }>;
}

async function RepoPage({ params }: RepoPageProps) {
  const parsedParams = await params;
  const data = await getRepoWithMetadata(parsedParams.id);

  if (!data) {
    notFound();
  }

  return (
    <RepoClientPage
      repoId={parsedParams.id}
      initialData={data.repo}
      audit={data.audit}
    />
  );
}

export default RepoPage;
