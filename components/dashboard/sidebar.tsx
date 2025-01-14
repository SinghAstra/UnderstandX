"use client";

import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { addUserRepositories, useRepository } from "../context/repository";
import SidebarRepoHeader from "./sidebar-repo-header";
import SidebarRepoList from "./sidebar-repo-list";

export function Sidebar() {
  const { state, dispatch } = useRepository();
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const repositories = state.userRepositories;

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
        dispatch(addUserRepositories(data.repositories));
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
    [toast, dispatch]
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
      <div className="flex flex-col h-full">
        <SidebarRepoHeader
          loading={isInitialLoad}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="flex-1 overflow-hidden">
          <SidebarRepoList
            searchQuery={searchQuery}
            loading={isInitialLoad || loading}
            repositories={repositories}
          />
        </div>
      </div>
    </div>
  );
}
