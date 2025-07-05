"use client";
import Navbar from "@/components/repo-details/navbar";
import { RepositoryWithRelationsAndOverview } from "@/interfaces/github";
import { File } from "@prisma/client";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (filePath: string) => {
    const matchedFile = repository.files.find((file) => file.path === filePath);
    if (!matchedFile) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(matchedFile);
  };

  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar repository={repository} user={user} />
      <div className="flex mt-20">
        <RepoContent
          repository={repository}
          selectedFilePath={selectedFile?.path || null}
          handleFileSelect={handleFileSelect}
        />
        {!selectedFile ? (
          <RepoOverview overview={repository.overview ?? "No Overview"} />
        ) : (
          <FileViewer selectedFile={selectedFile} />
        )}
      </div>
    </div>
  );
};

export default RepoExplorer;
