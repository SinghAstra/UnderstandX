"use client";
import Navbar from "@/components/repo-details/navbar";
import { RepositoryWithRelationsAndOverview } from "@/interfaces/github";
import { User } from "next-auth";
import { useState } from "react";
import { FileViewer } from "./file-viewer";
import RepoContent from "./repo-content";
import RepoOverview from "./repo-overview";

interface RepoExplorerProps {
  repository: RepositoryWithRelationsAndOverview;
  user: User;
}

const RepoExplorer = ({ repository, user }: RepoExplorerProps) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const handleFileSelect = async (filePath: string) => {
    setSelectedFilePath(filePath);
  };

  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar repository={repository} user={user} />
      <div className="flex mt-20">
        <RepoContent
          repository={repository}
          selectedFilePath={selectedFilePath}
          handleFileSelect={handleFileSelect}
        />
        {!selectedFilePath ? (
          <RepoOverview parsedOverview={repository.parsedOverview} />
        ) : (
          <FileViewer
            files={repository.files}
            selectedFilePath={selectedFilePath}
          />
        )}
      </div>
    </div>
  );
};

export default RepoExplorer;
