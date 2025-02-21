"use client";

import { RepositoryWithRelations } from "@/app/repository/[...path]/page";
import Terminal from "@/components/ui-components/terminal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ProcessingUpdate } from "@/interfaces/processing";
import pusherClient from "@/lib/pusher/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RepoProcessingLogs = () => {
  const params = useParams();
  const router = useRouter();
  const [isFetchingRepository, setIsFetchingRepository] = useState(true);
  const repositoryId = params.id as string;
  const { toast } = useToast();
  const [repository, setRepository] = useState<
    RepositoryWithRelations | undefined
  >();
  const [logLines, setLogLines] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>();

  useEffect(() => {
    if (repository) return;
    const fetchRepositoryDetails = async () => {
      try {
        setIsFetchingRepository(true);
        const response = await fetch(`/api/repository/${repositoryId}`);
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Failed to fetch repository details.");
        }
        setRepository(data.repository);

        if (data.repository.status === "SUCCESS") {
          router.replace(`/repository/${repositoryId}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error message:", error.message);
          console.log("Error stack:", error.stack);
        }
        setMessage("Network Connectivity Problem. Please try again.");
      } finally {
        setIsFetchingRepository(false);
      }
    };
    fetchRepositoryDetails();
  }, [repository, repositoryId, setMessage, router]);

  useEffect(() => {
    if (!message) return;
    toast({ title: message });
    setMessage(null);
  }, [toast, message, setMessage]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`repository-${repositoryId}`);

    channel.bind("processing-update", (update: ProcessingUpdate) => {
      console.log("update.status is ", update.status);

      // Add log line
      setLogLines((prevLines) => [...prevLines, `${update.message}`]);

      if (update.status === "SUCCESS") {
        router.replace(`/repository/${repositoryId}`);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`repository-${repositoryId}`);
    };
  }, [repositoryId, router]);

  const RepositoryHeaderSkeleton = () => {
    return (
      <div className="flex items-center space-x-4 mb-4 border-b-2 px-2 py-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-3 w-[200px]" />
        </div>
      </div>
    );
  };

  // Handling various repository states
  if (isFetchingRepository) {
    return (
      <div className="p-2 container mx-auto">
        <RepositoryHeaderSkeleton />
        <Terminal
          lines={["Fetching repository information..."]}
          welcomeMessage="NavX Repository Processing"
          color="blue"
        />
      </div>
    );
  }

  const RepositoryHeader = () => {
    if (!repository) return null;

    return (
      <div className="flex items-center space-x-4 mb-4 border-b-2 p-2">
        <Image
          src={repository.avatarUrl}
          alt={`${repository.owner}'s avatar`}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{repository.name}</h2>
          <p className="text-sm text-muted">{repository.owner}</p>
        </div>
      </div>
    );
  };

  if (!repository) {
    return (
      <div className=" p-2 container mx-auto">
        <Terminal
          lines={["Repository not found"]}
          welcomeMessage="NavX Repository Processing"
          color="red"
        />
      </div>
    );
  }

  if (repository.status === "CANCELLED") {
    return (
      <div className=" p-2 container mx-auto">
        {RepositoryHeader()}
        <Terminal
          lines={["Repository processing has been cancelled"]}
          welcomeMessage="NavX Repository Processing"
          color="red"
        />
      </div>
    );
  }

  if (repository.status === "FAILED") {
    return (
      <div className=" p-2 container mx-auto">
        {RepositoryHeader()}
        <Terminal
          lines={["An error occurred while processing your repository"]}
          welcomeMessage="NavX Repository Processing"
          color="red"
        />
      </div>
    );
  }

  return (
    <div className=" p-2 container mx-auto ">
      {RepositoryHeader()}
      <Terminal
        lines={logLines}
        welcomeMessage={`Processing Repository: ${repository.name}`}
        color="green"
        height={500}
      />
    </div>
  );
};

export default RepoProcessingLogs;
