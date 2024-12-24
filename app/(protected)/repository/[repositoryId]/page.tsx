"use client";

import { FilePreview } from "@/components/repository/file-preview";
import RepositoryHeader from "@/components/repository/repository-header";
import { SearchBar } from "@/components/repository/search-bar";
import { SearchResults } from "@/components/repository/search-results";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const RepositoryPage = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  // const [selectedResult, setSelectedResult] = useState(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoadingResults(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          repositoryId: params.repositoryId,
        }),
      });

      const data = await response.json();
      console.log("data --repositoryPage is ", data);
      // setResults(data.results);
    } catch (error) {
      console.log("Search error:", error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  console.log("isLoadingResults is ", isLoadingResults);
  console.log("results is ", results);

  return (
    <div className="min-h-screen bg-background">
      <RepositoryHeader />

      {/* Main Content */}
      <main className="container mx-auto py-4">
        {/* Search and Filters Section */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="space-y-4 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value);
                handleSearch(value);
              }}
            />
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
