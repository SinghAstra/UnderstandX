"use client";

import { fetchAllUserRepository } from "@/lib/api";
import { Repository } from "@prisma/client";
import { useEffect } from "react";
import useSWR from "swr";
import { useToastContext } from "../providers/toast";
import SidebarRepoHeader from "./left-sidebar-repo-header";
import SidebarRepoList from "./left-sidebar-repo-list";

interface LeftSidebarProps {
  initialRepositories: Repository[];
}

export function LeftSidebar({ initialRepositories }: LeftSidebarProps) {
  const { setToastMessage } = useToastContext();
  const { data: repositories } = useSWR<Repository[]>(fetchAllUserRepository, {
    fallbackData: initialRepositories,
  });

  useEffect(() => {
    const activateBackEnd = async () => {
      try {
        const response = await fetch("/api/activate-backend");
        const data = await response.json();
        if (!response.ok) {
          setToastMessage(data.message);
          return;
        }
        console.log("data is ", data);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setToastMessage("Check Your Network Connection");
      }
    };

    activateBackEnd();
  }, [setToastMessage]);

  return (
    <div className="w-full md:fixed md:inset-y-0 md:left-0 md:w-96 bg-background md:border-r md:border-dashed md:pt-16">
      <div className="flex flex-col h-full">
        <SidebarRepoHeader />
        <div className="flex-1 overflow-hidden ">
          {repositories && <SidebarRepoList repositories={repositories} />}
        </div>
      </div>
    </div>
  );
}
