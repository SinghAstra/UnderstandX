"use client";

import { RepositoryWithRelations } from "@/app/repository/[...path]/page";
import { useRepository } from "@/components/context/repository";
import RepoLogs from "@/components/repo-logs";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const RepoProcessingLogs = () => {
  const params = useParams();
  const [isFetchingRepository, setIsFetchingRepository] = useState(true);
  const [message, setMessage] = useState<string>();
  const repositoryId = params.id as string;
  const { toast } = useToast();
  const { state } = useRepository();
  const [repository, setRepository] = useState<RepositoryWithRelations>(
    state.repositoryDetails[repositoryId]
  );

  useEffect(() => {
    if (repository) return;
    const fetchRepositoryDetails = async () => {
      try {
        setIsFetchingRepository(true);
        const response = await fetch(`/api/repository/${repositoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repository details.");
        }
        const data = await response.json();
        setRepository(data.repository);
        console.log("data repository-logs is ", data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error message:", error.message);
          console.log("Error stack:", error.stack);
        }
        setMessage("Failed to fetch repository details.");
      } finally {
        setIsFetchingRepository(false);
      }
    };
    fetchRepositoryDetails();
  }, [repository, repositoryId]);

  useEffect(() => {
    if (!message) return;
    toast({ title: message });
  }, [toast, message]);

  if (isFetchingRepository) {
    return <div>Fetching Repository Info at Repository Logs Page</div>;
  }

  if (!repository) {
    return <div>Repository not found at Repository Logs Page</div>;
  }

  if (repository.status === "CANCELLED") {
    return <div>Your Repository Processing has been cancelled.</div>;
  }

  if (repository.status === "FAILED") {
    return <div>An error occurred while processing your repository.</div>;
  }

  return <RepoLogs repositoryId={repositoryId} />;
};

export default RepoProcessingLogs;
