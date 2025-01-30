import { ProcessingUpdate } from "@/interfaces/processing";
import pusherClient from "@/lib/pusher/client";
import { useEffect, useState } from "react";

export function useProcessingStatus(repositoryId: string) {
  const [logs, setLogs] = useState<ProcessingUpdate[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`repository-${repositoryId}`);

    channel.bind("processing-update", (update: ProcessingUpdate) => {
      setLogs((prevLogs) => [...prevLogs, update]);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`repository-${repositoryId}`);
    };
  }, [repositoryId]);

  return logs;
}
