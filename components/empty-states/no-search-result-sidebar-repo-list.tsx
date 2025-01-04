import { Search } from "lucide-react";
import React from "react";

const NoSearchResultsSidebarRepoList = ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] px-4">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="font-medium mb-2">No matching repositories</h3>
      <p className="text-sm text-muted-foreground text-center">
        No repositories found matching{" "}
        <span className="text-primary">&quot;{searchQuery}&quot;</span>
      </p>
    </div>
  );
};

export default NoSearchResultsSidebarRepoList;
