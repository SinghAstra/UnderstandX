"use client";

import { useToast } from "@/hooks/use-toast";
import { Directory, Feature, File, Repository } from "@prisma/client";
import { FileIcon, FolderIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface DirectoryWithRelations extends Directory {
  children: DirectoryWithRelations[];
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
  console.log("params.id is ", params.id);
  const [message, setMessage] = useState("");
  const [repository, setRepository] = useState<RepositoryWithRelations>();
  const { toast } = useToast();

  const treeData = useMemo<TreeData>(() => {
    if (!repository) return { rootDirectories: [], rootFiles: [] };

    const directoryNodes: { [key: string]: DirectoryWithRelations } = {};
    const rootFiles: File[] = [];

    // First pass: create directory nodes - with empty children and files for now
    repository.directories.forEach((dir) => {
      directoryNodes[dir.id] = {
        ...dir,
        children: [],
        files: [],
      };
    });

    // Second pass: establish parent-child relationships - for all directoryTree Relations
    repository.directories.forEach((dir) => {
      if (dir.parentId && directoryNodes[dir.parentId]) {
        directoryNodes[dir.parentId].children.push(directoryNodes[dir.id]);
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

  useEffect(() => {
    try {
      const fetchRepositoryDetails = async () => {
        const response = await fetch(`/api/repository/${params.id}`);
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
    }
  }, [params.id]);

  useEffect(() => {
    toast({ title: message });
  }, [toast, message]);

  const renderFile = (file: File, level: number) => (
    <div
      key={file.id}
      className="flex items-center gap-2 hover:bg-secondary/50 p-2 rounded-md transition-colors"
      style={{ marginLeft: `${level * 20}px` }}
    >
      <FileIcon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-light text-foreground">{file.name}</span>
    </div>
  );

  const renderDirectory = (
    directory: DirectoryWithRelations,
    level: number
  ) => (
    <div key={directory.id} className="flex flex-col">
      <div
        className="flex items-center gap-2 hover:bg-secondary/50 p-2 rounded-md transition-colors"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <FolderIcon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          {directory.path.split("/").pop()}
        </span>
      </div>

      {directory.files.map((file) => renderFile(file, level + 1))}
      {directory.children.map((child) => renderDirectory(child, level + 1))}
    </div>
  );

  return (
    <div className="flex flex-col space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-foreground">
        Repository Details: {repository?.name || params.id}
      </h1>
      {repository && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-foreground">
              Repository Structure
            </h2>
          </div>
          <div className="space-y-1 max-w-4xl mx-auto">
            {treeData.rootDirectories.map((dir) => renderDirectory(dir, 0))}
            {treeData.rootFiles.map((file) => renderFile(file, 0))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryPage;
