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
        dispatch({ type: "REMOVE_ACTIVE_REPOSITORY", payload: repoId });
      },
    });

    return () => {
      statusManagerRef.current?.disconnectAll();
    };
  }, []);

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
