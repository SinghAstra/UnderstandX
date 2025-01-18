import { RepositoryStatus } from "@prisma/client";
import { useEffect, useState } from "react";

// useRepositoryLogs.ts
const useRepositoryLogs = (repositoryId: string) => {
  interface ProcessingLog {
    timestamp: Date;
    status: RepositoryStatus;
    message: string;
  }

  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const { activeRepositories } = useProcessingState(); // Our context state

  useEffect(() => {
    if (repositoryId in activeRepositories) {
      const eventSource = new EventSource(
        `/api/repositories/${repositoryId}/stream`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date(),
            status: data.status,
            message: data.message,
          },
        ]);
      };

      return () => eventSource.close();
    }
  }, [repositoryId, activeRepositories]);

  return logs;
};
