"use client";

import { FilePreview } from "@/components/repository/file-preview";
import RepositoryHeader from "@/components/repository/repository-header";
import { SearchBar } from "@/components/repository/search-bar";
import { SearchResults } from "@/components/repository/search-results";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

const RepositoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const results = [
    {
      id: 1,
      fileName: "SearchEngine.ts",
      path: "src/lib/search",
      language: "TypeScript",
      preview: "export class SearchEngine implements ISearchEngine {",
      matches: ["search", "engine"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <RepositoryHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filters Section */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="space-y-4 mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Results and Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Results List */}
          <div className="lg:col-span-5">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <SearchResults results={results} />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <FilePreview />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryPage;
