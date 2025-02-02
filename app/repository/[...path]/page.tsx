"use client";

import { useRepository } from "@/components/context/repository";
import RepositoryExplorer from "@/components/explorer";
import { useToast } from "@/hooks/use-toast";
import { Directory, Feature, File, Repository } from "@prisma/client";
import { FileIcon, FolderIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface DirectoryWithRelations extends Directory {
  directories: DirectoryWithRelations[];
  files: File[];
}

export interface RepositoryWithRelations extends Repository {
  files: File[];
  directories: Directory[];
  features: Feature[];
}

interface TreeData {
  rootDirectories: DirectoryWithRelations[];
  rootFiles: File[];
}

interface FetchState {
  status: "idle" | "loading" | "success" | "error";
  error?: string;
}

const RepositoryPage = () => {
  const params = useParams();
  // const logs = useProcessingStatus(params.id as string);
  const [message, setMessage] = useState<string | null>();
  const { state, dispatch } = useRepository();
  const pathSegments = (params.path as string[]) || [];
  const repositoryId = pathSegments[0];
  const router = useRouter();
  const repository = state.repositoryDetails[repositoryId];
  const [fetchState, setFetchState] = useState<FetchState>({
    status: repository ? "success" : "idle",
  });

  console.log("fetchState is ", fetchState);

  const getSelectedPath = () => {
    if (pathSegments.length <= 1) return null;

    // Take all segments after the repositoryId (index 0)
    return pathSegments
      .slice(1)
      .map((segment) => decodeURIComponent(segment))
      .join("/");
  };

  const selectedPath = getSelectedPath();

  const { toast } = useToast();

  const treeData = useMemo<TreeData>(() => {
    if (!repository) return { rootDirectories: [], rootFiles: [] };

    const directoryNodes: { [key: string]: DirectoryWithRelations } = {};
    const rootFiles: File[] = [];

    // First pass: create directory nodes - with empty directories and files for now
    repository.directories.forEach((dir) => {
      directoryNodes[dir.id] = {
        ...dir,
        directories: [],
        files: [],
      };
    });

    // Second pass: establish parent-child relationships - for all directoryTree Relations
    repository.directories.forEach((dir) => {
      if (dir.parentId && directoryNodes[dir.parentId]) {
        directoryNodes[dir.parentId].directories.push(directoryNodes[dir.id]);
      }
    });

    // Third pass: assign files to directories or root
    repository.files.forEach((file) => {
      if (file.directoryId && directoryNodes[file.directoryId]) {
        directoryNodes[file.directoryId].files.push(file);
      } else {
        rootFiles.push(file);
      }
    });

    // Get root directories (those without parents)
    const rootDirectories = repository.directories
      .filter((dir) => !dir.parentId)
      .map((dir) => directoryNodes[dir.id]);

    return {
      rootDirectories,
      rootFiles,
    };
  }, [repository]);

  const handleSelect = (path: string) => {
    console.log("path is ", path);
    const encodedPath = path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    router.push(`/repository/${repositoryId}/${encodedPath}`);
  };

  useEffect(() => {
    const fetchRepositoryDetailsIfNeeded = async () => {
      // Don't fetch if we already have the repository data
      try {
        if (!state.repositoryDetails[repositoryId]) {
          setFetchState({ status: "loading" });
          const response = await fetch(`/api/repository/${repositoryId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch repository details.");
          }
          const data = await response.json();
          console.log("response is ", response);
          dispatch({
            type: "ADD_REPOSITORY_DETAILS",
            payload: { id: repositoryId, data: data.repository },
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          setFetchState({
            status: "error",
            error: error.message,
          });
          console.log("Error message:", error.message);
          console.log("Error stack:", error.stack);
        }
        setMessage("Failed to fetch repository details.");
      } finally {
        setFetchState({ status: "success" });
      }
    };
    fetchRepositoryDetailsIfNeeded();
  }, [repositoryId, dispatch, state.repositoryDetails]);

  useEffect(() => {
    if (!message) return;
    toast({ title: message });
  }, [toast, message]);

  useEffect(() => {
    if (fetchState.status === "error") {
      toast({
        title: fetchState.error,
      });
    }
  }, [fetchState, toast]);

  const renderRootFile = (file: File) => (
    <div
      key={file.id}
      className="flex items-center gap-2 hover:bg-secondary/50 p-2 rounded-md transition-colors hover:cursor-pointer"
      onClick={() => handleSelect(file.path)}
    >
      <FileIcon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-light text-foreground">{file.name}</span>
    </div>
  );

  const renderRootDirectory = (directory: DirectoryWithRelations) => (
    <div key={directory.id} className="flex flex-col">
      <div
        className="flex items-center gap-2 hover:bg-secondary/50 p-2 rounded-md transition-colors hover:cursor-pointer"
        onClick={() => handleSelect(directory.path)}
      >
        <FolderIcon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          {directory.path.split("/").pop()}
        </span>
      </div>
    </div>
  );

  if (fetchState.status === "loading" || fetchState.status === "idle") {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Loading...</p>
      </div>
    );
  }

  if (fetchState.status === "error" || !repository) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Failed to fetch repository.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-6 ">
      {!selectedPath ? (
        <div className="flex flex-col gap-2 max-w-4xl mx-auto w-full border-border rounded-md border-2 p-2">
          {treeData.rootDirectories.map((directory) =>
            renderRootDirectory(directory)
          )}
          {treeData.rootFiles.map((file) => renderRootFile(file))}
        </div>
      ) : (
        <RepositoryExplorer
          treeData={treeData}
          selectedPath={selectedPath}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};

export default RepositoryPage;
