"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Repository } from "@prisma/client";
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Icons } from "../Icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface OpenStates {
  [key: string]: boolean;
}

export function ToolsSidebar() {
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
    <div className="w-80 bg-background p-4">
      <h2 className="mb-4 text-lg leading-relaxed">Our Ecosystem</h2>

      {!isFetchingActiveRepositories &&
        activeRepos &&
        activeRepos.length > 0 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Active Repositories
              </CardTitle>
              <CardDescription>
                Currently processing {activeRepos.length} repositories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
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
                      <Icons.gitLogo className="h-4 w-4" />
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
            </CardContent>
          </Card>
        )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            ChatRepoX
          </CardTitle>
          <CardDescription>
            Chat with your GitHub repositories using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Ask questions about your code and get intelligent responses based on
            your repository content.
          </p>
          <Button className="w-full">Try ChatRepoX</Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
          <CardDescription>
            More tools are being developed to enhance your development workflow.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
