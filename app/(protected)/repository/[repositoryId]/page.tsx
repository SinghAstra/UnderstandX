"use client";

import FilePreview from "@/components/repository/file-preview";
import RepositoryHeader from "@/components/repository/repository-header";
import { SearchBar } from "@/components/repository/search-bar";
import { SearchResults } from "@/components/repository/search-results";
import RepositoryPageSkeleton from "@/components/skeleton/repository-page-skeleton";
import useRepository from "@/hooks/use-repository";
import { SearchResultFile, SimilarChunk } from "@/interfaces/search-result";
import { notFound, useParams } from "next/navigation";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const RepositoryPage = () => {
  const params = useParams();
  const {
    repositoryInfo,
    loading: loadingRepositoryInfo,
    error,
  } = useRepository(params.repositoryId as string);
  const [searchQuery, setSearchQuery] = useState("");
  const [similarChunks, setSimilarChunks] = useState<SimilarChunk[]>([]);
  const [isLoadingSimilarChunks, setIsLoadingSimilarChunks] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SearchResultFile>();

  const handleSearch = async (query: string) => {
    setIsLoadingSimilarChunks(true);
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
      setSimilarChunks(data.similarChunks);
      setSelectedFile(undefined);
    } catch (error) {
      console.log("Search error:", error);
      setSimilarChunks([]);
    } finally {
      setIsLoadingSimilarChunks(false);
    }
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    handleSearch(value);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSimilarChunks([]);
      setSelectedFile(undefined);
      return;
    }
    debouncedSearch(value);
  };

  if (loadingRepositoryInfo) {
    return (
      <RepositoryPageSkeleton loadingRepositoryInfo={loadingRepositoryInfo} />
    );
  }

  if (error || !repositoryInfo) {
    notFound();
  }

  const groupedResults = similarChunks.reduce((acc, similarChunk) => {
    const key = similarChunk.filepath;
    if (!acc[key]) {
      acc[key] = {
        filepath: similarChunk.filepath,
        type: similarChunk.type,
        repositoryName: similarChunk.repositoryName,
        similarChunks: [],
        repositoryFullName: similarChunk.repositoryFullName,
      };
    }
    acc[key].similarChunks.push({
      id: similarChunk.id,
      filepath: similarChunk.filepath,
      type: similarChunk.type,
      repositoryName: similarChunk.repositoryName,
      content: similarChunk.content,
      similarity: similarChunk.similarity,
      repositoryFullName: similarChunk.repositoryFullName,
    });
    return acc;
  }, {} as Record<string, SearchResultFile>);

  const searchResultUniqueFiles = Object.values(groupedResults);

  return (
    <div className="min-h-screen bg-background">
      <RepositoryHeader
        repository={repositoryInfo.repository}
        githubStats={repositoryInfo.githubStats}
      />

      <main className="container mx-auto py-2 flex flex-col gap-2 animate-in fade-in">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />

        {/* Results and Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Results List */}
          <div className="lg:col-span-4">
            <SearchResults
              searchResultUniqueFiles={searchResultUniqueFiles}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              isLoading={isLoadingSimilarChunks}
            />
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-8">
            <FilePreview file={selectedFile} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryPage;
