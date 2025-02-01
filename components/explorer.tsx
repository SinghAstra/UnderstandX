"use client";

import { cn } from "@/lib/utils";
import { Directory, Feature, File, Repository } from "@prisma/client";
import { ChevronDown, ChevronRight, FileIcon, FolderIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

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

const DirectoryTree = ({
  directory,
  level,
  expandedDirs,
  setExpandedDirs,
  selectedPath,
  onSelect,
}: {
  directory: DirectoryWithRelations;
  level: number;
  expandedDirs: Set<string>;
  setExpandedDirs: (dirs: Set<string>) => void;
  selectedPath: string | null;
  onSelect: (type: "file" | "directory", path: string) => void;
}) => {
  const isExpanded = expandedDirs.has(directory.path);

  const toggleExpand = () => {
    const newExpanded = new Set(expandedDirs);
    if (isExpanded) {
      newExpanded.delete(directory.path);
    } else {
      newExpanded.add(directory.path);
    }
    setExpandedDirs(newExpanded);
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center gap-2 hover:bg-secondary/50 p-2 rounded-md transition-colors cursor-pointer",
          selectedPath === directory.path && "bg-secondary"
        )}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div
          className="p-1 hover:bg-secondary rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
        <div
          className="flex items-center gap-2 flex-1"
          onClick={() => onSelect("directory", directory.path)}
        >
          <FolderIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {directory.path.split("/").pop()}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          {directory.files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              level={level + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
          {directory.directories.map((dir) => (
            <DirectoryTree
              key={dir.id}
              directory={dir}
              level={level + 1}
              expandedDirs={expandedDirs}
              setExpandedDirs={setExpandedDirs}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileItem = ({
  file,
  level,
  selectedPath,
  onSelect,
}: {
  file: File;
  level: number;
  selectedPath: string | null;
  onSelect: (type: "file" | "directory", path: string) => void;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 hover:bg-secondary/50 p-2 rounded-md transition-colors cursor-pointer",
      selectedPath === file.name && "bg-secondary"
    )}
    style={{ marginLeft: `${level * 20}px` }}
    onClick={() => onSelect("file", file.name)}
  >
    <FileIcon className="w-4 h-4 text-muted-foreground" />
    <span className="text-sm font-light">{file.name}</span>
  </div>
);

const RepositoryExplorer = ({
  repository,
}: {
  repository: RepositoryWithRelations;
}) => {
  const router = useRouter();
  const params = useParams();
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const treeData = useMemo<TreeData>(() => {
    if (!repository) return { rootDirectories: [], rootFiles: [] };

    const directoryNodes: { [key: string]: DirectoryWithRelations } = {};
    const rootFiles: File[] = [];

    // Create directory nodes
    repository.directories.forEach((dir) => {
      directoryNodes[dir.id] = {
        ...dir,
        directories: [],
        files: [],
      };
    });

    // Establish parent-child relationships
    repository.directories.forEach((dir) => {
      if (dir.parentId && directoryNodes[dir.parentId]) {
        directoryNodes[dir.parentId].directories.push(directoryNodes[dir.id]);
      }
    });

    // Assign files to directories or root
    repository.files.forEach((file) => {
      if (file.directoryId && directoryNodes[file.directoryId]) {
        directoryNodes[file.directoryId].files.push(file);
      } else {
        rootFiles.push(file);
      }
    });

    const rootDirectories = repository.directories
      .filter((dir) => !dir.parentId)
      .map((dir) => directoryNodes[dir.id]);

    return {
      rootDirectories,
      rootFiles,
    };
  }, [repository]);

  const handleSelect = (type: "file" | "directory", path: string) => {
    setSelectedPath(path);
    // Update URL with the selected path
    router.push(`/repository/${params.id}/${type}/${encodeURIComponent(path)}`);
  };

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-border overflow-y-auto p-2">
        {treeData.rootDirectories.map((dir) => (
          <DirectoryTree
            key={dir.id}
            directory={dir}
            level={0}
            expandedDirs={expandedDirs}
            setExpandedDirs={setExpandedDirs}
            selectedPath={selectedPath}
            onSelect={handleSelect}
          />
        ))}
        {treeData.rootFiles.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            level={0}
            selectedPath={selectedPath}
            onSelect={handleSelect}
          />
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedPath && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">{selectedPath}</h2>
            {/* Add your file/directory content component here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryExplorer;
