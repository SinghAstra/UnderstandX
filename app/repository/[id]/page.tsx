import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getRepositoryData } from "./action";
import RepoExplorer from "./repo-explorer";

type RepositoryLayoutProps = {
  params: { id: string };
};

export default async function RepositoryPage({
  params,
}: RepositoryLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }
  console.log("Before getRepositoryData");

  const repository = await getRepositoryData(params.id);
  if (!repository) {
    notFound();
  }

  console.log("repository.files in page.tsx is ", repository.files);

  return <RepoExplorer repository={repository} user={session.user} />;
}
