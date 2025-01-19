import { createContext, useContext, useReducer } from "react";
import { initialState, repositoryReducer } from "./repository.reducer";
import { RepositoryAction, RepositoryState } from "./repository.types";

interface RepositoryContextType {
  state: RepositoryState;
  dispatch: React.Dispatch<RepositoryAction>;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(
  undefined
);

// interface SSEMessage {
//   status: RepositoryStatus;
//   message: string;
// }

// const NEXT_PUBLIC_EXPRESS_API_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL!;

export function RepositoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(repositoryReducer, initialState);
  // const eventSourcesRef = useRef<Record<string, EventSource>>({});

  // useEffect(() => {
  // Connect to any new repositories
  //   state.activeRepositories.forEach((repo) => {
  // Skip if EventSource already exists
  //     if (eventSourcesRef.current[repo.id]) return;

  //     const eventSource = new EventSource(
  //       `${NEXT_PUBLIC_EXPRESS_API_URL}/api/repository/${repo.id}/stream`
  //     );

  //     eventSource.onmessage = (event) => {
  //       const data: SSEMessage = JSON.parse(event.data);

  //       console.log("data --RepositoryProvider is ", data);

  //       dispatch({
  //         type: "UPDATE_REPOSITORY_STATUS",
  //         payload: {
  //           id: repo.id,
  //           status: data.status,
  //         },
  //       });

  //       if (data.status === "SUCCESS" || data.status === "FAILED") {
  // Close and cleanup connection
  //         eventSource.close();
  //         delete eventSourcesRef.current[repo.id];

  //         dispatch({
  //           type: "REMOVE_ACTIVE_REPOSITORY",
  //           payload: repo.id,
  //         });
  //       }
  //     };

  //     eventSource.onerror = () => {
  // Close and cleanup on error
  //       eventSource.close();
  //       delete eventSourcesRef.current[repo.id];

  //       dispatch({
  //         type: "UPDATE_REPOSITORY_STATUS",
  //         payload: {
  //           id: repo.id,
  //           status: "FAILED" as RepositoryStatus,
  //         },
  //       });

  //       dispatch({
  //         type: "REMOVE_ACTIVE_REPOSITORY",
  //         payload: repo.id,
  //       });
  //     };

  //     eventSourcesRef.current[repo.id] = eventSource;
  //   });

  // Cleanup any connections for repositories no longer active
  //   Object.keys(eventSourcesRef.current).forEach((repoId) => {
  //     if (!state.activeRepositories.find((repo) => repo.id === repoId)) {
  //       const eventSource = eventSourcesRef.current[repoId];
  //       if (eventSource) {
  //         eventSource.close();
  //         delete eventSourcesRef.current[repoId];
  //       }
  //     }
  //   });

  // Cleanup all connections on unmount
  //   return () => {
  //     Object.values(eventSourcesRef.current).forEach((es) => es.close());
  //     eventSourcesRef.current = {};
  //   };
  // }, [state.activeRepositories]);

  return (
    <RepositoryContext.Provider value={{ state, dispatch }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
}
