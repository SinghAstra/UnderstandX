"use client";

import Terminal from "@/components/ui-components/terminal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RepositoryWithRelations } from "@/interfaces/github";
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
  const [repository, setRepository] = useState<RepositoryWithRelations | null>(
    null
  );
  const [logs, setLogs] = useState<ProcessingUpdate[]>([]);
  const [message, setMessage] = useState<string | null>(null);

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
      setLogs((prevLogs) => [...prevLogs, update]);

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

  const TerminalSkeleton = () => {
    // Create an array of 5 fake log entries for the skeleton
    const skeletonLogs = Array(5).fill(null);

    return (
      <div className="w-full bg-background">
        <div className="relative">
          <div className="bg-card rounded-lg border border-border">
            <div
              className="rounded-md p-4 font-mono text-sm space-y-4"
              style={{ height: "400px" }}
            >
              {skeletonLogs.map((_, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {/* Time skeleton */}
                  <Skeleton className="h-4 w-16" />

                  {/* Message skeleton - varying widths for more natural look */}
                  <Skeleton
                    className={`h-4 ${index % 2 === 0 ? "w-3/4" : "w-1/2"}`}
                  />

                  {/* Status skeleton - show on some entries */}
                  {index % 3 === 0 && <Skeleton className="h-4 w-16" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handling various repository states
  if (isFetchingRepository) {
    return (
      <div className="p-2 container mx-auto max-w-2xl w-full">
        <RepositoryHeaderSkeleton />
        <TerminalSkeleton />
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
      <div className="p-2 container mx-auto">
        <p>Repository Not Found</p>
      </div>
    );
  }

  if (repository.status === "CANCELLED") {
    return (
      <div className=" p-2 container mx-auto">
        {RepositoryHeader()}
        <p>Repository Cancelled</p>
      </div>
    );
  }

  if (repository.status === "FAILED") {
    return (
      <div className=" p-2 container mx-auto">
        {RepositoryHeader()}
        <p>Error Occurred</p>
      </div>
    );
  }

  return (
    <div className=" p-2 container mx-auto max-w-2xl w-full ">
      {RepositoryHeader()}
      <Terminal logs={logs} />
    </div>
  );
};

export default RepoProcessingLogs;
