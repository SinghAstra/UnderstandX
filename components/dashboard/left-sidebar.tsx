"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { setUserRepositories, useRepository } from "../context/repository";
import SidebarRepoHeader from "./left-sidebar-repo-header";
import SidebarRepoList from "./left-sidebar-repo-list";

export function LeftSidebar() {
  const { state, dispatch } = useRepository();
  const [isFetchingRepository, setIsFetchingRepository] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const repositories = state.userRepositories;

  const fetchRepositories = useCallback(async () => {
    try {
      setIsFetchingRepository(true);

      const response = await fetch("/api/repository");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
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
    toast(message);
    setMessage(null);
  }, [message]);

  return (
    <div className="w-full md:fixed md:inset-y-0 md:left-0 md:w-96 bg-background md:border-r md:border-dashed md:pt-16">
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
