"use client";
import Navbar from "@/components/repo-details/navbar";
import RepositorySkeleton from "@/components/skeleton/repository";
import { useToast } from "@/hooks/use-toast";
import { RepositoryWithRelations } from "@/interfaces/github";
import { File } from "@prisma/client";

import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import FileViewer from "./file-viewer";
import RepositoryExplorer from "./repository-explorer";

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

      <div className="flex mt-20">
        <RepositoryExplorer
          repository={repository}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
        {!selectedFile ? (
          <div className="w-full flex-1 p-3 ml-96">
            <div className="border border-border rounded-lg p-3">
              {repository.overview}
            </div>
          </div>
        ) : (
          <FileViewer file={selectedFile} isFileLoading={isFileLoading} />
        )}
      </div>
    </div>
  );
};

export default RepositoryDetailsPage;
