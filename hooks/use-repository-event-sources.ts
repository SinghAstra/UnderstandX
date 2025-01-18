import { RepositoryStatus } from "@prisma/client";
import { useEffect } from "react";

interface SSEMessage {
  status: RepositoryStatus;
  message: string;
}

const useRepositoryEventSources = (
  activeRepositories: Record<string, ActiveRepository>
) => {
  const dispatch = useProcessingDispatch(); // Our context dispatch

  useEffect(() => {
    // Create event sources for all active repositories
    const eventSources: Record<string, EventSource> = {};

    Object.keys(activeRepositories).forEach((repoId) => {
      const eventSource = new EventSource(`/api/repositories/${repoId}/stream`);

      eventSource.onmessage = (event) => {
        const data: SSEMessage = JSON.parse(event.data);

        // Update global processing state
        dispatch({
          type: "UPDATE_PROCESSING_STATUS",
          payload: { repositoryId: repoId, ...data },
        });

        // Handle terminal states
        if (data.status === "SUCCESS" || data.status === "FAILED") {
          eventSource.close();
          delete eventSources[repoId];
          dispatch({
            type: "COMPLETE_PROCESSING",
            payload: { repositoryId: repoId, status: data.status },
          });
        }
      };

      eventSources[repoId] = eventSource;
    });

    // Cleanup
    return () => {
      Object.values(eventSources).forEach((es) => es.close());
    };
  }, [activeRepositories, dispatch]);
};
