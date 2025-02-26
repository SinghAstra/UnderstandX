"use client";
import Navbar from "@/components/repo-details/navbar";
import RepositorySkeleton from "@/components/skeleton/repository";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { FileMetaData, RepositoryWithRelations } from "@/interfaces/github";
import { File } from "@prisma/client";
import { CircleHelp, FileText } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import FileViewer from "./file-viewer";

// Component to display a file
const FileItem = React.memo(
  ({
    file,
    onFileSelect,
  }: {
    file: File;
    onFileSelect: (file: File) => void;
  }) => {
    console.log("File Item is rendered", file.path);
    return (
      <div
        className="flex items-center justify-between py-1 px-2 hover:bg-secondary cursor-pointer text-md transition-colors duration-150 border-b border-dotted"
        onClick={() => {
          onFileSelect(file);
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText size={16} className="text-muted-foreground mr-[2px] " />
          <span className="font-light tracking-wider  truncate max-w-[calc(100%-24px)]">
            {file.name}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CircleHelp size={16} className="text-muted-foreground " />
            </TooltipTrigger>
            <TooltipContent className="bg-muted text-muted-foreground m-2 rounded-md">
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

FileItem.displayName = "File Item";

// Main repository explorer component
const RepositoryExplorer = ({
  repository,
  onFileSelect,
}: {
  repository: RepositoryWithRelations;
  onFileSelect: (file: File) => void;
}) => {
  return (
    <div className="border-r border-border border-dotted fixed inset-y-0 left-0 w-96 mt-20 overflow-auto">
      <div className="p-3 ">
        {repository.files.map((file) => {
          return (
            <FileItem key={file.id} file={file} onFileSelect={onFileSelect} />
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
  const { id } = params;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileLoading, setIsFileLoading] = useState(false);

  const onFileSelect = useCallback(
    async (file: FileMetaData) => {
      const controller = new AbortController();
      const signal = controller.signal;

      // Cancel any ongoing request
      if (window.currentFileRequest) {
        window.currentFileRequest.abort();
      }
      window.currentFileRequest = controller;

      try {
        setIsFileLoading(true);
        console.log("File selected:", file);
        const response = await fetch(`/api/repository/${id}/file/${file.id}`, {
          signal,
        });

        if (!response.ok) {
          const data = await response.json();
          setMessage(data.message || "Failed to fetch file content.");
          return;
        }

        const data = await response.json();
        console.log("data --onFileSelect is ", data);
        setSelectedFile(data.file);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request aborted for file:", file.name);
          return; // Silently exit if the request was aborted
        }
        console.log("Error fetching file:", error);
        setMessage("Check Your Network Connectivity.");
      } finally {
        setIsFileLoading(false);
      }
    },
    [id]
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
            {/* Root level files */}
            {repository.files.map((file) => {
              return (
                <FileItem
                  key={file.id}
                  file={file}
                  onFileSelect={onFileSelect}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex">
            <RepositoryExplorer
              repository={repository}
              onFileSelect={onFileSelect}
            />
            <FileViewer file={selectedFile} isFileLoading={isFileLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryDetailsPage;
