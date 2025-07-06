import React from "react";
import { fetchTrendingTypeScriptRepos } from "./action";
import { NavbarPreview } from "./navbar-preview";

const DashboardPreview = async () => {
  const trendingRepos = await fetchTrendingTypeScriptRepos();
  const parsedTrendingRepos = trendingRepos.map((repo) => repo.name);
  console.log("parsedTrendingRepos ", parsedTrendingRepos);
  return (
    <div className="min-h-screen">
      <NavbarPreview />
      <div className="flex ">
        {/* <LeftSidebar initialRepositories={repositories} /> */}
        Hey There
        {/* <main className="hidden lg:flex flex-1 ml-96 ">{children}</main> */}
        {/* <RightSidebar /> */}
      </div>
    </div>
  );
};

export default DashboardPreview;
