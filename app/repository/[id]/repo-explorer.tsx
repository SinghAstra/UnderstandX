import Navbar from "@/components/repo-details/navbar";
import { RepositoryWithRelations } from "@/interfaces/github";
import { User } from "next-auth";
import { Suspense } from "react";
import FileViewer from "./file-viewer";
import { FileViewerSkeleton } from "./file-viewer-skeleton";
import RepoContent from "./repo-content";
import RepoOverview from "./repo-overview";

interface RepoExplorerProps {
  repository: RepositoryWithRelations;
  user: User;
  searchParams: { fileId?: string };
}

const RepoExplorer = ({
  repository,
  user,
  searchParams,
}: RepoExplorerProps) => {
  const fileId = searchParams.fileId;

  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar repository={repository} user={user} />
      <div className="flex mt-20">
        <RepoContent repository={repository} selectedFileId={fileId} />
        {/* {!selectedFile ? ( */}
        {!fileId ? (
          <RepoOverview overview={repository.overview} />
        ) : (
          <Suspense fallback={<FileViewerSkeleton />}>
            <FileViewer fileId={fileId} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default RepoExplorer;
