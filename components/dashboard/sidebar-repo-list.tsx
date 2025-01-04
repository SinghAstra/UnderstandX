import { Repository } from "@prisma/client";
import React from "react";
import EmptyRepositoriesSidebarRepoList from "../empty-states/empty-repo-sidebar-repo-list";
import NoSearchResultsSidebarRepoList from "../empty-states/no-search-result-sidebar-repo-list";
import { RepositoryCard } from "../repository/repository-card";
import { SidebarRepoListSkeleton } from "../skeleton/sidebar-repo-list-skeleton";
import { ScrollArea } from "../ui/scroll-area";

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
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-2 pb-4">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default SidebarRepoList;
