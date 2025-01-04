"use client";

import { useToast } from "@/hooks/use-toast";
import { Repository } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SidebarRepoHeader from "./sidebar-repo-header";
import SidebarRepoList from "./sidebar-repo-list";

export function Sidebar() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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
        setIsInitialLoad(false);
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
        <SidebarRepoHeader
          loading={isInitialLoad}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SidebarRepoList
          loading={isInitialLoad || loading}
          repositories={repositories}
        />
      </div>
    </div>
  );
}
