"use client";
import Navbar from "@/components/repo-details/navbar";
import RepositorySkeleton from "@/components/skeleton/repository";
import { useToast } from "@/hooks/use-toast";
import {
  DirectoryWithRelations,
  RepositoryWithRelations,
} from "@/interfaces/github";
import { File } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import FileViewer from "./file-viewer";

// Component to display a file
const FileItem = React.memo(
  ({
    file,
    onFileSelect,
    selectedFile,
  }: {
    file: File;
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
  }) => {
    return (
      <div
        className="flex items-center justify-between py-1 px-2 hover:bg-secondary cursor-pointer text-md transition-colors duration-150 border-b border-dotted "
        onClick={() => {
          if (file.path !== selectedFile?.path) {
            onFileSelect(file);
          }
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText size={16} className="text-muted-foreground mr-[2px] " />
          <span className="font-light tracking-wider  truncate max-w-[calc(100%-24px)]">
            {file.name}
          </span>
        </div>
      </div>
    );
  }
);

FileItem.displayName = "File Item";

// Component to display a directory and its contents
const DirectoryItem = React.memo(
  ({
    directory,
    level = 0,
    selectedFile,
    onFileSelect,
  }: {
    directory: DirectoryWithRelations;
    selectedFile: File | null;
    level: number;
    onFileSelect: (file: File) => void;
  }) => {
    const isSelectedFileInThisDirectory = selectedFile?.path.includes(
      directory.path
    );
    const [isOpen, setIsOpen] = useState(isSelectedFileInThisDirectory);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
      <div>
        <div
          className=" relative flex items-center py-1 px-2 hover:bg-secondary cursor-pointer text-md transition-colors duration-150 "
          onClick={toggleOpen}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <span className="mr-1 text-muted-foreground">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          {isOpen ? (
            <FolderOpen size={16} className="text-stats-blue mr-2" />
          ) : (
            <Folder size={16} className="text-muted-foreground mr-2" />
          )}
          <span className="font-normal tracking-wider">
            {directory.path.split("/").pop()}
          </span>
        </div>

        {isOpen && (
          <div className="mt-1">
            {/* Display subdirectories */}
            {directory.children?.map((child) => (
              <DirectoryItem
                key={child.id}
                directory={child}
                level={level + 1}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
              />
            ))}

            {/* Display files in this directory */}
            {directory.files?.map((file) => (
              <div
                key={file.id}
                style={{ paddingLeft: `${level * 16 + 24}px` }}
              >
                <FileItem
                  file={file}
                  onFileSelect={onFileSelect}
                  selectedFile={selectedFile}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DirectoryItem.displayName = "Directory Item";

// Main repository explorer component
const RepositoryExplorer = ({
  selectedFile,
  repository,
  onFileSelect,
}: {
  selectedFile: File | null;
  repository: RepositoryWithRelations;
  onFileSelect: (file: File) => void;
}) => {
  return (
    <div className="border-r border-border border-dotted fixed inset-y-0 left-0 w-96 mt-20 overflow-auto">
      <div className="p-3 ">
        {/* Root directories */}
        {repository.directories?.map((directory) => (
          <DirectoryItem
            level={0}
            key={directory.id}
            directory={directory}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
          />
        ))}
        {/* Root level files */}
        {repository.files
          ?.filter((file) => !file.directoryId)
          .map((file) => {
            return (
              <FileItem
                selectedFile={selectedFile}
                key={file.id}
                file={file}
                onFileSelect={onFileSelect}
              />
            );
          })}
      </div>
    </div>
  );
};

// Updated Repository Details Page
const RepositoryDetailsPage = () => {
  const [repository, setRepository] = useState<RepositoryWithRelations | null>(
    null
  );
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const router = useRouter();

  const onFileSelect = useCallback(
    (file: File) => {
      setIsFileLoading(true);
      router.push(`/repository/${id}?file=${file.path}`, { scroll: false });
    },
    [router, id]
  );

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/repository/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to fetch repository details.");
          return;
        }

        setRepository(data.repository);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Check Your Network Connectivity.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepository();
  }, [id]);

  useEffect(() => {
    const filePath = searchParams.get("file");
    if (filePath && repository) {
      const file = repository.files.find((f) => f.path === filePath);
      if (file) setSelectedFile(file);
      setIsFileLoading(false);
    } else {
      // Handle the case when file parameter is removed
      setSelectedFile(null);
      setIsFileLoading(false);
    }
  }, [repository, searchParams]);

  useEffect(() => {
    if (!message) return;
    toast({ title: message });
    setMessage(null);
  }, [toast, message]);

  if (isLoading) {
    return (
      <div>
        <Navbar repository={repository} />
        <RepositorySkeleton />
      </div>
    );
  }

  if (!repository) {
    return notFound();
  }

  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar repository={repository} />

      <div className="mt-20">
        {!selectedFile ? (
          <div className="border border-border rounded-lg overflow-hidden bg-card mx-auto w-full max-w-2xl p-3">
            {/* Root directories */}
            {repository?.directories.map((directory) => (
              <DirectoryItem
                level={0}
                key={directory.id}
                directory={directory}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
              />
            ))}
            {/* Root level files */}
            {repository?.files
              ?.filter((file) => !file.directoryId)
              .map((file) => {
                return (
                  <FileItem
                    key={file.id}
                    file={file}
                    onFileSelect={onFileSelect}
                    selectedFile={selectedFile}
                  />
                );
              })}
          </div>
        ) : (
          <div className="flex">
            <RepositoryExplorer
              repository={repository}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
            <FileViewer file={selectedFile} isFileLoading={isFileLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryDetailsPage;
