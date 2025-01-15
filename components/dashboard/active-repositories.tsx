import { useToast } from "@/hooks/use-toast";
import { RepositoryStatus } from "@prisma/client";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  addActiveRepositories,
  removeActiveRepository,
  useRepository,
} from "../context/repository";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Skeleton } from "../ui/skeleton";

interface OpenStates {
  [key: string]: boolean;
}

interface ProcessingStatus {
  [key: string]: RepositoryStatus;
}

const repositorySteps = [
  { status: "PENDING", label: "Initializing" },
  { status: "FETCHING_GITHUB_REPO_FILES", label: "Fetching Repository Files" },
  { status: "CHUNKING_FILES", label: "Processing Files" },
  { status: "EMBEDDING_CHUNKS", label: "Generating Embeddings" },
  { status: "SUCCESS", label: "Completed" },
];

const TERMINAL_STATUSES: RepositoryStatus[] = [
  "SUCCESS",
  "CANCELED",
  "FETCHING_GITHUB_REPO_FILES_FAILED",
  "CHUNKING_FILES_FAILED",
  "EMBEDDING_CHUNKS_FAILED",
];

const ActiveRepositories = () => {
  const { state, dispatch } = useRepository();
  const [isFetchingActiveRepositories, setIsFetchingActiveRepositories] =
    useState(true);
  const [openStates, setOpenStates] = useState<OpenStates>({});
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const activeRepos = state.activeRepositories;

  const getStepIcon = (repoId: string, stepStatus: string) => {
    const currentStatus = processingStatus[repoId];

    // Get the indices for comparison
    const currentStepIndex = repositorySteps.findIndex(
      (step) => step.status === currentStatus
    );
    const stepIndex = repositorySteps.findIndex(
      (step) => step.status === stepStatus
    );

    // Handle failed states
    if (currentStatus?.includes("FAILED")) {
      if (currentStatus === `${stepStatus}_FAILED`) {
        return <XCircle className="h-5 w-5 text-destructive" />;
      }
      if (
        stepIndex <
        repositorySteps.findIndex(
          (step) => step.status === currentStatus.replace("_FAILED", "")
        )
      ) {
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      }
      return <Circle className="h-5 w-5 text-gray-500" />;
    }

    // Current step
    if (stepStatus === currentStatus) {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }

    // Completed steps
    if (currentStepIndex > stepIndex || currentStatus === "SUCCESS") {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }

    // Future steps
    return <Circle className="h-5 w-5 text-gray-500" />;
  };

  useEffect(() => {
    const fetchActiveRepositories = async () => {
      try {
        setError(null);
        const response = await fetch("/api/repositories/active");
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch active repositories");
        }

        if (data.hasActiveRepositories && data.activeRepositories) {
          console.log("data.activeRepositories is ", data.activeRepositories);
          dispatch(addActiveRepositories(data.activeRepositories));
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong while fetching active repositories");
        }
      } finally {
        setIsFetchingActiveRepositories(false);
      }
    };
    fetchActiveRepositories();
  }, [toast, dispatch]);

  // Effect to handle changes in activeRepos
  useEffect(() => {
    // Setup collapsible states for new repositories
    activeRepos.forEach((repo) => {
      // Setup collapsible state if not exists
      setOpenStates((prev) => ({
        ...prev,
        [repo.id]: prev[repo.id] ?? false,
      }));
    });

    // Cleanup states for removed repositories
    setOpenStates((prev) => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach((repoId) => {
        if (!activeRepos.find((repo) => repo.id === repoId)) {
          delete newStates[repoId];
        }
      });
      return newStates;
    });
  }, [activeRepos]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const toggleCollapse = (repoId: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [repoId]: !prev[repoId],
    }));
  };

  if (isFetchingActiveRepositories) {
    return (
      <div className="mb-4 border-2 rounded-md p-2 flex flex-col gap-2">
        <span className="text-sm tracking-wide">Processing Repositories</span>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {activeRepos && activeRepos.length > 0 && (
        <div className="mb-4 border-2 rounded-md p-2 flex flex-col gap-2">
          <span className="text-sm tracking-wide">Processing Repositories</span>
          {activeRepos.map((repo) => (
            <Collapsible
              key={repo.id}
              open={openStates[repo.id]}
              className="border rounded-lg p-2"
            >
              <CollapsibleTrigger
                className="flex items-center justify-between w-full"
                onClick={() => toggleCollapse(repo.id)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    {repo.avatarUrl && <AvatarImage src={repo.avatarUrl} />}
                    <AvatarFallback className="text-lg">
                      {repo.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{repo.name}</span>
                </div>
                {openStates[repo.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-4">
                  {repositorySteps.map((step) => (
                    <div key={step.status} className="flex items-center gap-3">
                      {getStepIcon(repo.id, step.status)}
                      <span
                        className={`text-sm ${
                          processingStatus[repo.id] === step.status
                            ? "text-blue-500 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveRepositories;
