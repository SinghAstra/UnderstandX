"use client";

import Terminal from "@/components/ui-components/terminal";
import { ProcessingUpdate } from "@/interfaces/processing";
import pusherClient from "@/lib/pusher/client";
import { Repository } from "@prisma/client";
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
      if (update.status === "FAILED") {
        router.replace(`/dashboard`);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`repository-${repositoryId}`);
    };
  }, [repositoryId, router]);

  return <Terminal logs={logs} repository={repository} />;
};

export default RepoLogs;
