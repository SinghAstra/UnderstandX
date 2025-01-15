import { Repository } from "@prisma/client";
import React from "react";
import { useRepository } from "../context/repository";
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
  const { state } = useRepository();
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
        {repositories.map((repo) => {
          // Check if there's a real-time status update
          const realtimeStatus = state.processingStatuses[repo.id];
          // If there is, create a new repository object with the updated status
          const updatedRepo = realtimeStatus
            ? { ...repo, status: realtimeStatus }
            : repo;

          if (realtimeStatus) {
            console.log("Updating status for ", repo.id, realtimeStatus);
          }
          return <RepositoryCard key={repo.id} repository={updatedRepo} />;
        })}
      </div>
    </div>
  );
};

export default SidebarRepoList;
