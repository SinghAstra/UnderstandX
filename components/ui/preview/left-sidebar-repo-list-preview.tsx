import { Repository } from "@prisma/client";
import React from "react";

interface SidebarRepoListPreviewProps {
  repositories: Repository[];
}

const SidebarRepoListPreview = ({
  repositories,
}: SidebarRepoListPreviewProps) => {
  return (
    <div className="h-full overflow-y-auto px-4 ">
      <div className="flex flex-col gap-4 ">
        {/* {repositories.map((repo) => {
          return <RepositoryCard key={repo.id} repository={repo} />;
        })} */}
      </div>
    </div>
  );
};

export default SidebarRepoListPreview;
