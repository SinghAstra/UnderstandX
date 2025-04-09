"use client";
import Navbar from "@/components/repo-details/navbar";
import {
  FileWithParsedAnalysisAndCode,
  RepositoryWithRelationsAndOverview,
} from "@/interfaces/github";
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
  const [selectedFile, setSelectedFile] =
    useState<FileWithParsedAnalysisAndCode | null>(null);

  const handleFileSelect = (file: FileWithParsedAnalysisAndCode) => {
    setSelectedFile(file);
  };

  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar repository={repository} user={user} />
      <div className="flex mt-20">
        <RepoContent
          repository={repository}
          selectedFile={selectedFile}
          handleFileSelect={handleFileSelect}
        />
        {!selectedFile ? (
          <RepoOverview parsedOverview={repository.parsedOverview} />
        ) : (
          <FileViewer file={selectedFile} />
        )}
      </div>
    </div>
  );
};

export default RepoExplorer;
