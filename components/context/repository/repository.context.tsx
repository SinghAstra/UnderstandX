import { useToast } from "@/hooks/use-toast";
import { RepositoryStatusManager } from "@/lib/repository/status-manager";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { initialState, repositoryReducer } from "./repository.reducer";
import { RepositoryAction, RepositoryState } from "./repository.types";

interface RepositoryContextType {
  state: RepositoryState;
  dispatch: React.Dispatch<RepositoryAction>;
  statusManager: RepositoryStatusManager | null;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(
  undefined
);

export function RepositoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(repositoryReducer, initialState);
  const statusManagerRef = useRef<RepositoryStatusManager | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    statusManagerRef.current = new RepositoryStatusManager({
      onStatusUpdate: (repoId, update) => {
        dispatch({
          type: "UPDATE_REPOSITORY_STATUS",
          payload: {
            repoId,
            status: update.status,
          },
        });
      },
      onTerminalStatus: (repoId) => {
        const status = state.processingStatuses[repoId];
        const repo = state.activeRepositories.find((r) => r.id === repoId);

        toast({
          title: status === "SUCCESS" ? "Success" : "Processing Failed",
          description: `${repo?.name || repoId} ${
            status === "SUCCESS" ? "processed successfully" : "failed"
          }`,
          variant: status === "SUCCESS" ? "default" : "destructive",
        });

        dispatch({ type: "REMOVE_ACTIVE_REPOSITORY", payload: repoId });
      },
    });

    return () => {
      statusManagerRef.current?.disconnectAll();
    };
  }, [dispatch, toast, state.activeRepositories, state.processingStatuses]);

  useEffect(() => {
    // Connect new repositories
    state.activeRepositories.forEach((repo) => {
      if (!statusManagerRef.current?.isConnected(repo.id)) {
        statusManagerRef.current?.connect(repo.id);
      }
    });
  }, [state.activeRepositories]);

  return (
    <RepositoryContext.Provider
      value={{ state, dispatch, statusManager: statusManagerRef.current }}
    >
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
