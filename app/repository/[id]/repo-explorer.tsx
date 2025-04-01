"use client";
import Navbar from "@/components/repo-details/navbar";
import { RepositoryWithRelations } from "@/interfaces/github";
import { File } from "@prisma/client";
import { User } from "next-auth";
import React, {
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useState,
} from "react";
import FileViewer from "./file-viewer";
import RepoContent from "./repo-content";

interface RepoExplorerProps {
  repository: RepositoryWithRelations;
  user: User;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overview: ReactElement<any, string | JSXElementConstructor<any>>;
}

const RepoExplorer = ({ repository, user, overview }: RepoExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);

  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  const onFileSelect = useCallback((file: File) => {
    setIsFileLoading(true);
    setSelectedFile(file);
    setIsFileLoading(false);
  }, []);

  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar
        repository={repository}
        selectedFile={selectedFile}
        clearSelectedFile={clearSelectedFile}
        user={user}
      />
      <div className="flex mt-20">
        <RepoContent
          repository={repository}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
        {!selectedFile ? (
          <div className="w-full flex-1 p-3 ml-96">
            <div className="border rounded-md px-4 py-3 ">{overview}</div>
          </div>
        ) : (
          <FileViewer file={selectedFile} isFileLoading={isFileLoading} />
        )}
      </div>
    </div>
  );
};

export default RepoExplorer;
