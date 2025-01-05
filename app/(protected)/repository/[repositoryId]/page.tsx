"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchContainer } from "./search-container";

interface RecommendedSearch {
  query: string;
  description: string;
}

const RepositoryPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current states
  const currentSearch = searchParams.get("q") || "";
  const selectedFile = searchParams.get("file") || "";

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // const handleFileSelect = (filePath: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("file", filePath);
  //   router.push(`${pathname}?${params.toString()}`);
  // };

  // Initial UI - Centered search when no query
  if (!currentSearch) {
    return <SearchContainer onSearch={handleSearch} />;
  }

  // Search results view with split pane
  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File List */}
        <div className="w-80 border-r overflow-y-auto p-4">
          <h2 className="font-semibold mb-4">Search Results</h2>
          {/* Add your FileList component here */}
        </div>

        {/* File Viewer */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedFile ? (
            <div>{/* Add your FileViewer component here */}</div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;
