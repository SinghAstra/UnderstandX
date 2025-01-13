import { Repository } from "@prisma/client";
import React from "react";
import EmptyRepositoriesSidebarRepoList from "../empty-states/empty-repo-sidebar-repo-list";
import NoSearchResultsSidebarRepoList from "../empty-states/no-search-result-sidebar-repo-list";
import { RepositoryCard } from "../repository/repository-card";
import { SidebarRepoListSkeleton } from "../skeleton/sidebar-repo-list-skeleton";

interface SidebarRepoListProps {
  searchQuery?: string;
  loading?: boolean;
  repositories?: Repository[];
}

const SidebarRepoList = ({
  searchQuery,
  loading,
  repositories,
}: SidebarRepoListProps) => {
  if (loading) {
    return <SidebarRepoListSkeleton />;
  }

  if (!repositories || repositories?.length === 0) {
    if (searchQuery) {
      return <NoSearchResultsSidebarRepoList searchQuery={searchQuery} />;
    }
    return <EmptyRepositoriesSidebarRepoList />;
  }
  return (
    <div className="h-full overflow-y-auto px-4">
      <div className="flex flex-col gap-4">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>
    </div>
  );
};

export default SidebarRepoList;
