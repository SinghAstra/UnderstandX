"use client";

import { FilePreview } from "@/components/repository/file-preview";
import RepositoryHeader from "@/components/repository/repository-header";
import { SearchBar } from "@/components/repository/search-bar";
import { SearchResults } from "@/components/repository/search-results";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SelectedFile {
  filepath: string;
  type: string;
  repositoryName: string;
  matches: Array<{
    id: string;
    content: string;
    similarity: number;
  }>;
}

const RepositoryPage = () => {
  const params = useParams();
  console.log("params is ", params);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);

  const handleSearch = async (query: string) => {
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

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setResults(data.results);
      setSelectedFile(null);
    } catch (error) {
      console.log("Search error:", error);
      setResults([]);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    handleSearch(value);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      handleSearch();
      return;
    }
    debouncedSearch(value);
  };

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
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Results and Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Results List */}
          <div className="lg:col-span-5">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <SearchResults
                  results={results}
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  isLoading={isLoadingResults}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <FilePreview file={selectedFile} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryPage;
