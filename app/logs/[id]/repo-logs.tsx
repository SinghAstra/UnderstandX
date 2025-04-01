"use client";

import Terminal from "@/components/ui-components/terminal";
import { ProcessingUpdate } from "@/interfaces/processing";
import pusherClient from "@/lib/pusher/client";
import { Repository } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RepoLogsProps {
  repository: Repository;
}

const RepoLogs = ({ repository }: RepoLogsProps) => {
  const router = useRouter();
  const [logs, setLogs] = useState<ProcessingUpdate[]>([]);

  const repositoryId = repository.id;

  useEffect(() => {
    const channel = pusherClient.subscribe(`repository-${repositoryId}`);

    channel.bind("processing-update", (update: ProcessingUpdate) => {
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

  if (repository.status === "FAILED") {
    return (
      <div className="p-2 container mx-auto">
        <RepositoryHeader repository={repository} />
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-medium">Processing Failed</p>
          <p className="text-gray-700">
            There was an error processing this repository.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-2xl w-full ">
      <RepositoryHeader repository={repository} />
      <Terminal logs={logs} />
    </div>
  );
};

const RepositoryHeader = ({ repository }: { repository: Repository }) => (
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

export default RepoLogs;
