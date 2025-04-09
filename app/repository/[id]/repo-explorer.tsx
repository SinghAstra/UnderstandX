"use client";
import Navbar from "@/components/repo-details/navbar";
import {
  ParsedFile,
  RepositoryWithRelationsAndOverview,
} from "@/interfaces/github";
import { File } from "@prisma/client";
import { User } from "next-auth";
import { useState } from "react";
import { parseFile } from "./action";
import { FileViewer } from "./file-viewer";
import RepoContent from "./repo-content";
import RepoOverview from "./repo-overview";

interface RepoExplorerProps {
  repository: RepositoryWithRelationsAndOverview;
  user: User;
}

const RepoExplorer = ({ repository, user }: RepoExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<ParsedFile | null>(null);

  const handleFileSelect = async (file: File) => {
    const parsedFile = await parseFile(file);

    setSelectedFile(parsedFile);
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
