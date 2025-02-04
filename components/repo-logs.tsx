import { ProcessingUpdate } from "@/interfaces/processing";
import pusherClient from "@/lib/pusher/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RepoLogs = ({ repositoryId }: { repositoryId: string }) => {
  const [logs, setLogs] = useState<ProcessingUpdate[]>([]);
  const router = useRouter();

  useEffect(() => {
    const channel = pusherClient.subscribe(`repository-${repositoryId}`);

    channel.bind("processing-update", (update: ProcessingUpdate) => {
      console.log("update.status is ", update.status);
      if (update.status === "SUCCESS") {
        router.push(`/repository/${repositoryId}`);
      }
      setLogs((prevLogs) => [...prevLogs, update]);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`repository-${repositoryId}`);
    };
  }, [repositoryId, router]);
  return (
    <div>
      <h1>Processing logs for repository {repositoryId}</h1>

      {logs.map((log, index) => (
        <div key={index}>
          {log.message} - {log.status}
        </div>
      ))}
    </div>
  );
};

export default RepoLogs;
