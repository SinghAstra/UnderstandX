import { Repository } from "@prisma/client";
import React from "react";
import { RepositoryCard } from "../repository/repository-card";
import { SidebarRepoListSkeleton } from "../skeleton/sidebar-repo-list-skeleton";
import { ScrollArea } from "../ui/scroll-area";

interface SidebarRepoListProps {
  loading?: boolean;
  repositories?: Repository[];
}

const SidebarRepoList = ({ loading, repositories }: SidebarRepoListProps) => {
  if (loading) {
    return <SidebarRepoListSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No repositories found
      </div>
    );
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
