"use client";

import RepositoryExplorer from "@/components/explorer";
// import RepositoryExplorer from "@/components/explorer";
import { useToast } from "@/hooks/use-toast";
import { Directory, Feature, File, Repository } from "@prisma/client";
import { FileIcon, FolderIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface DirectoryWithRelations extends Directory {
  directories: DirectoryWithRelations[];
  files: File[];
}

interface RepositoryWithRelations extends Repository {
  files: File[];
  directories: Directory[];
  features: Feature[];
}

interface TreeData {
  rootDirectories: DirectoryWithRelations[];
  rootFiles: File[];
}

const RepositoryPage = () => {
  const params = useParams();
  // const logs = useProcessingStatus(params.id as string);
  const [message, setMessage] = useState<string | null>();
  const [repository, setRepository] = useState<RepositoryWithRelations>();
  const [isFetchingRepository, setIsFetchingRepository] = useState(true);
  const pathSegments = (params.path as string[]) || [];
  const repositoryId = pathSegments[0];
  const router = useRouter();

  const getSelectedPath = () => {
    if (pathSegments.length <= 1) return null;
    return decodeURIComponent(pathSegments.slice(1).join("/"));
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
    router.push(`/repository/${repositoryId}/${encodeURIComponent(path)}`);
  };

  console.log("isFetchingRepository is ", isFetchingRepository);
  console.log("repository is ", repository);
  console.log("repositoryId is ", repositoryId);

  useEffect(() => {
    try {
      setIsFetchingRepository(true);
      const fetchRepositoryDetails = async () => {
        const response = await fetch(`/api/repository/${repositoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repository details.");
        }
        const data = await response.json();
        console.log("response is ", response);
        console.log("data is ", data);
        setRepository(data.repository);
      };
      fetchRepositoryDetails();
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error message:", error.message);
        console.log("Error stack:", error.stack);
      }
      setMessage("Failed to fetch repository details.");
    } finally {
      setIsFetchingRepository(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    if (!message) return;
    toast({ title: message });
  }, [toast, message]);

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

  if (isFetchingRepository) {
    return <p>Loading...</p>;
  }

  if (!repository && !isFetchingRepository) {
    return <p>Failed to fetch repository.</p>;
  }

  if (repository && !treeData) {
    return <p>Building Tree...</p>;
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
