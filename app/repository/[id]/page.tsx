"use client";
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
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Component to display a file
const FileItem = ({ file }: { file: File }) => {
  return (
    <div className="flex items-center py-1 px-2 hover:bg-secondary rounded cursor-pointer text-sm transition-colors duration-150">
      <FileText size={16} className="text-muted-foreground mr-2" />
      <span className="font-medium">{file.name}</span>
    </div>
  );
};

// Component to display a directory and its contents
const DirectoryItem = ({
  directory,
  level = 0,
}: {
  directory: DirectoryWithRelations;
  level: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 hover:bg-secondary rounded cursor-pointer text-sm transition-colors duration-150"
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
            <DirectoryItem key={child.id} directory={child} level={level + 1} />
          ))}

          {/* Display files in this directory */}
          {directory.files?.map((file) => (
            <div key={file.id} style={{ paddingLeft: `${level * 16 + 24}px` }}>
              <FileItem file={file} />
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
}: {
  repository: RepositoryWithRelations;
}) => {
  if (!repository) {
    return (
      <div className="p-4 text-muted-foreground">Loading repository...</div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="bg-secondary px-4 py-3 flex items-center border-b border-border">
        <h2 className="text-md font-semibold">{repository.name}</h2>
      </div>
      <div className="p-3 max-h-96 overflow-y-auto">
        {/* Root level files */}
        {repository.files
          ?.filter((file) => !file.directoryId)
          .map((file) => (
            <FileItem key={file.id} file={file} />
          ))}

        {/* Root directories */}
        {repository.directories?.map((directory) => (
          <DirectoryItem level={0} key={directory.id} directory={directory} />
        ))}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/repository/${id}`);
        const data = await response.json();

        if (!response.ok) {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch repository details.",
            variant: "destructive",
          });
          return;
        }

        setRepository(data.repository);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        toast({
          title: "Error",
          description: "Something went wrong when fetching repository data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [id, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-secondary rounded w-full opacity-30"></div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">
            {repository?.name || "Repository"}
          </h1>
          <div className="bg-grid-white">
            {repository && <RepositoryExplorer repository={repository} />}
          </div>
        </>
      )}
    </div>
  );
};

export default RepositoryDetailsPage;
