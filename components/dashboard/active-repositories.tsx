import { useToast } from "@/hooks/use-toast";
import { Repository } from "@prisma/client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface OpenStates {
  [key: string]: boolean;
}

const ActiveRepositories = () => {
  const [activeRepos, setActiveRepos] = useState<Repository[]>();
  const [isFetchingActiveRepositories, setIsFetchingActiveRepositories] =
    useState(true);
  const [openStates, setOpenStates] = useState<OpenStates>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActiveRepositories = async () => {
    try {
      setError(null);
      const response = await fetch("/api/repositories/active");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch active repositories");
      }

      if (data.hasActiveRepositories) {
        setActiveRepos(data.repositories);
        // Initialize collapse state for new repositories
        const newOpenStates: OpenStates = {};
        data.repositories.forEach((repo: Repository) => {
          newOpenStates[repo.id] = false;
        });
        setOpenStates((prev) => ({ ...prev, ...newOpenStates }));
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

  useEffect(() => {
    fetchActiveRepositories();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
      });
    }
  }, [error, toast]);

  const toggleCollapse = (repoId: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [repoId]: !prev[repoId],
    }));
  };

  return (
    <div>
      {!isFetchingActiveRepositories &&
        activeRepos &&
        activeRepos.length > 0 && (
          <div className="mb-4 border-2 rounded-md p-2 flex flex-col gap-2">
            <span className="text-sm tracking-wide">
              Processing Repositories
            </span>
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
                <CollapsibleContent className="pt-2">
                  {/* <Progress
                      value={statusProgress[repo.status]}
                      className="h-2 mb-2"
                    /> */}
                  <p className="text-xs text-muted-foreground">
                    {/* {statusMessages[repo.status]} */}
                    This is where i will show progress
                  </p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
    </div>
  );
};

export default ActiveRepositories;
