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
import RepositoryExplorer from "./repository-explorer";

interface RepoExplorerProps {
  repository: RepositoryWithRelations;
  user: User;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overview: ReactElement<any, string | JSXElementConstructor<any>>;
}

const RepoExplorer = ({ repository, user, overview }: RepoExplorerProps) => {
  // const params = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  // const router = useRouter();
  // const id = params.id;

  const clearSelectedFile = () => {
    // Clear the selected file in state
    setSelectedFile(null);

    // Update the URL without triggering a navigation
    // const url = new URL(window.location.href);
    // url.searchParams.delete("file");
    // window.history.pushState({}, "", url);
  };

  const onFileSelect = useCallback((file: File) => {
    setIsFileLoading(true);
    // TODO : Is router.push slowing down the web app what if i just set the selected File manually ?
    // router.push(`/repository/${id}?file=${file.path}`, { scroll: false });
    setSelectedFile(file);
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
        <RepositoryExplorer
          repository={repository}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
        {!selectedFile ? (
          <div className="w-full flex-1 p-3 ml-96">
            <div className="border border-border rounded-lg max-w-none prose-invert px-4 py-3 ">
              {overview}
            </div>
          </div>
        ) : (
          "Nothing Here"
        )}
      </div>
    </div>
  );
};

export default RepoExplorer;
