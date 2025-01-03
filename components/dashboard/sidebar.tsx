"use client";

import { RepositoryCard } from "@/components/repository/repository-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Repository } from "@prisma/client";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function Sidebar() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchRepositories = useCallback(
    async (search?: string) => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: "1",
          limit: "10",
          ...(search && { search }),
        });

        const response = await fetch(`/api/repository?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repositories.");
        }

        const data = await response.json();
        setRepositories(data.repositories);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch repositories. Please try again later.",
        });
        console.log("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const debouncedSearch = useDebouncedCallback((value: string) => {
    fetchRepositories(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      fetchRepositories();
      return;
    }
    debouncedSearch(value);
  };

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  return (
    <div className="fixed inset-y-0 left-0 w-96 bg-background border-r pt-16">
      <div className="flex flex-col">
        <div className="p-4">
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Repository
          </Button>
          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {repositories.length > 0 ? (
              repositories.map((repo) => (
                <RepositoryCard key={repo.id} repository={repo} />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No repositories found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
