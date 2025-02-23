"use client";
import { AvatarMenu } from "@/components/custom-ui/avatar-menu";
import SignInButton from "@/components/custom-ui/sign-in-button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import {
  DirectoryWithRelations,
  RepositoryWithRelations,
} from "@/interfaces/github";
import { File } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Component to display a file
const FileItem = ({
  file,
  onFileSelect,
}: {
  file: File;
  onFileSelect: (file: File) => void;
}) => {
  return (
    <div className="flex items-center justify-between py-1 px-2 hover:bg-secondary rounded cursor-pointer text-md transition-colors duration-150">
      <div
        className="flex items-center gap-2"
        onClick={() => {
          console.log("File Clicked path is ", file.path);
          onFileSelect(file);
        }}
      >
        <FileText size={16} className="text-muted-foreground mr-2" />
        <span className="font-normal">{file.name}</span>
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
};

// Component to display a directory and its contents
const DirectoryItem = ({
  directory,
  level = 0,
  onFileSelect,
}: {
  directory: DirectoryWithRelations;
  level: number;
  onFileSelect: (file: File) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 hover:bg-secondary rounded cursor-pointer text-md transition-colors duration-150"
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
        <span className="font-medium">{directory.path.split("/").pop()}</span>
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
            />
          ))}

          {/* Display files in this directory */}
          {directory.files?.map((file) => (
            <div key={file.id} style={{ paddingLeft: `${level * 16 + 24}px` }}>
              <FileItem file={file} onFileSelect={onFileSelect} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main repository explorer component
const RepositoryExplorer = ({
  repository,
  onFileSelect,
}: {
  repository: RepositoryWithRelations;
  onFileSelect: (file: File) => void;
}) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card mx-auto w-full max-w-2xl">
      <div className="p-3 ">
        {/* Root directories */}
        {repository.directories?.map((directory) => (
          <DirectoryItem
            level={0}
            key={directory.id}
            directory={directory}
            onFileSelect={onFileSelect}
          />
        ))}
        {/* Root level files */}
        {repository.files
          ?.filter((file) => !file.directoryId)
          .map((file) => {
            console.log("file.id is", file.id);
            return (
              <FileItem key={file.id} file={file} onFileSelect={onFileSelect} />
            );
          })}
      </div>
    </div>
  );
};

const FileViewer = ({ file }: { file: File | null }) => {
  if (!file) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mt-4">File Content</h1>
      <div className="border border-border rounded-lg overflow-hidden bg-card p-3">
        {file.content}
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
  const { data: session, status } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    return <p>Wait Loading..</p>;
  }

  if (!repository) {
    return <p>Repository Not Found.</p>;
  }

  return (
    <div className=" min-h-screen flex flex-col">
      <header className=" px-4 py-2 flex items-center justify-between fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex gap-2 items-center">
          <Link href="/" className=" hover:opacity-80 transition-opacity">
            <span className="tracking-wide text-2xl font-medium">
              {siteConfig.name}
            </span>
          </Link>
          <a
            className="flex gap-2 items-center border p-2  rounded-lg w-fit cursor-pointer hover:bg-secondary transition-colors duration-150 group"
            href={repository.url}
            target="_blank"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={repository.avatarUrl} />
            </Avatar>
            <div className="flex gap-1">
              <span className="text-foreground">{repository.owner}</span>
              <span className="text-muted group-hover:text-muted-foreground ">
                {"/"}
              </span>
              <span className="text-foreground">{repository.name}</span>
            </div>
          </a>
        </div>

        {status === "loading" ? (
          <Skeleton className="h-10 w-10 rounded-full  border-primary border-2" />
        ) : session?.user ? (
          <AvatarMenu />
        ) : (
          <SignInButton />
        )}
      </header>

      <div className="mt-20 flex">
        <RepositoryExplorer
          repository={repository}
          onFileSelect={setSelectedFile}
        />
        <FileViewer file={selectedFile} />
      </div>
    </div>
  );
};

export default RepositoryDetailsPage;
