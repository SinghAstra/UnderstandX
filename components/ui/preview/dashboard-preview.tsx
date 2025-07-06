import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { RepositoryPreview } from "@/interfaces/github";
import React from "react";
import LeftSidebarRepoListPreview from "./left-sidebar-repo-list-preview";
import { NavbarPreview } from "./navbar-preview";
import NewRepoInputPreview from "./new-repo-input-preview";

const DashboardPreview = ({
  previewRepos,
}: {
  previewRepos: RepositoryPreview[];
}) => {
  return (
    <div className="min-h-screen">
      <NavbarPreview />
      <div className="flex ">
        <LeftSidebarRepoListPreview previewRepos={previewRepos} />
        <main className="hidden lg:flex flex-1 ml-[420px] ">
          <NewRepoInputPreview />
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

export default DashboardPreview;
