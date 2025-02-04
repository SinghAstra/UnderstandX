"use client";

import RepositoryContent, {
  RepositoryWithRelations,
} from "@/components/repo-content";
import RepoProcessingLogs from "@/components/repo-logs";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const RepositoryPage = () => {
  const params = useParams();
  const [message, setMessage] = useState<string | null>();
  const [repository, setRepository] = useState<RepositoryWithRelations>();
  const [isFetchingRepository, setIsFetchingRepository] = useState(true);
  const pathSegments = (params.path as string[]) || [];
  const repositoryId = pathSegments[0];
  const { toast } = useToast();

  console.log(
    "repository --RepositoryPage at Parent Component is ",
    repository
  );

  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      try {
        setIsFetchingRepository(true);
        const response = await fetch(`/api/repository/${repositoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repository details.");
        }
        const data = await response.json();
        setRepository(data.repository);
        console.log(
          "data --fetchRepositoryDetails at parent component is ",
          data
        );
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
  }, [repositoryId]);

  useEffect(() => {
    if (!message) return;
    toast({ title: message });
  }, [toast, message]);

  if (isFetchingRepository) {
    return (
      <div className="flex flex-col py-6 ">
        <p>Loading repository details at the Parent Component...</p>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="flex flex-col py-6 ">
        <p>No repository found at the Parent Component.</p>
      </div>
    );
  }

  if (repository.status === "PENDING" || repository.status === "PROCESSING") {
    return <RepoProcessingLogs />;
  }

  if (repository.status === "SUCCESS") {
    return <RepositoryContent />;
  }

  return (
    <div className="flex flex-col">
      Repo Status but not PENDING PROCESSING SUCCESS
    </div>
  );
};

export default RepositoryPage;
