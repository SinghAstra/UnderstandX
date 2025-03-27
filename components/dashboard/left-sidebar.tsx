"use client";

import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { setUserRepositories, useRepository } from "../context/repository";
import SidebarRepoHeader from "./left-sidebar-repo-header";
import SidebarRepoList from "./left-sidebar-repo-list";

export function LeftSidebar() {
  const { state, dispatch } = useRepository();
  const [isFetchingRepository, setIsFetchingRepository] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const repositories = state.userRepositories;

  const fetchRepositories = useCallback(async () => {
    try {
      setIsFetchingRepository(true);

      const response = await fetch("/api/repository");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch repositories.");
      }

      dispatch(setUserRepositories(data.repositories));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Check Your Network Connectivity.");
    } finally {
      setIsFetchingRepository(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  useEffect(() => {
    if (!message) return;
    toast({
      description: message,
    });
  }, [toast, message]);

  return (
    <div className="w-full md:fixed md:inset-y-0 md:left-0 md:w-96 bg-background border-r border-dotted md:pt-16">
      <div className="flex flex-col h-full">
        <SidebarRepoHeader />
        <div className="flex-1 overflow-hidden ">
          <SidebarRepoList
            loading={isFetchingRepository}
            repositories={repositories}
          />
        </div>
      </div>
    </div>
  );
}
