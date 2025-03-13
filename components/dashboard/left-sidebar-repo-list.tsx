import { Repository } from "@prisma/client";
import React from "react";
import { useRepository } from "../context/repository";
import EmptyRepositoriesSidebarRepoList from "../empty-states/empty-repo-sidebar-repo-list";
import { SidebarRepoListSkeleton } from "../skeleton/left-sidebar-repo-list-skeleton";
import { RepositoryCard } from "./left-sidebar-repository-card";

interface SidebarRepoListProps {
  loading?: boolean;
  repositories?: Repository[];
}

const SidebarRepoList = ({ loading, repositories }: SidebarRepoListProps) => {
  const { state } = useRepository();
  if (loading) {
    return <SidebarRepoListSkeleton />;
  }

  if (!repositories || repositories?.length === 0) {
    return <EmptyRepositoriesSidebarRepoList />;
  }
  return (
    <div className="h-full overflow-y-auto px-4 ">
      <div className="flex flex-col gap-4 ">
        {state.userRepositories.map((repo) => {
          return <RepositoryCard key={repo.id} repository={repo} />;
        })}
      </div>
    </div>
  );
};

export default SidebarRepoList;
