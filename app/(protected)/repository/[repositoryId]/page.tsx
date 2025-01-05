"use client";
import FilePreview from "@/components/repository/file-preview";
import { SearchResults } from "@/components/repository/search-results";
import { SearchContainer } from "@/components/semantic-search-repo/search-container";
import { SearchResultFile, SimilarChunk } from "@/interfaces/search-result";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const RepositoryPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Get current states
  const currentSearch = searchParams.get("q") || "";
  const selectedFilePath = searchParams.get("file") || "";
  const repositoryId = params.repositoryId;

  const [similarChunks, setSimilarChunks] = useState<SimilarChunk[]>([]);
  const [isLoadingSimilarChunks, setIsLoadingSimilarChunks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("In the useEffect.");
    console.log("currentSearch is ", currentSearch);
    console.log("repositoryId is ", repositoryId);
    if (!currentSearch || !repositoryId) return;

    const fetchSimilarChunks = async () => {
      setIsLoadingSimilarChunks(true);
      setError(null);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: currentSearch,
            repositoryId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setSimilarChunks(data.similarChunks);
      } catch (error) {
        console.log("Search error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Something Went wrong while fetching results"
        );
        setSimilarChunks([]);
      } finally {
        setIsLoadingSimilarChunks(false);
      }
    };

    fetchSimilarChunks();
  }, [currentSearch, repositoryId]);

  const groupedResults = useMemo(() => {
    return similarChunks.reduce((acc, chunk) => {
      const key = chunk.filepath;
      if (!acc[key]) {
        acc[key] = {
          filepath: chunk.filepath,
          type: chunk.type,
          repositoryName: chunk.repositoryName,
          repositoryFullName: chunk.repositoryFullName,
          similarChunks: [],
        };
      }
      acc[key].similarChunks.push(chunk);
      return acc;
    }, {} as Record<string, SearchResultFile>);
  }, [similarChunks]);

  const selectedFile = selectedFilePath
    ? groupedResults[selectedFilePath]
    : null;

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
      params.delete("file");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFileSelect = (filePath: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("file", filePath);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Initial UI - Centered search when no query
  if (!currentSearch) {
    return <SearchContainer onSearch={handleSearch} />;
  }

  console.log("groupedResults is ", groupedResults);
  console.log("isLoadingSimilarChunks is ", isLoadingSimilarChunks);

  // Search results view with split pane
  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File List */}
        <div className="w-80 border-r overflow-y-auto p-4">
          <SearchResults
            searchResultUniqueFiles={Object.values(groupedResults)}
            selectedFile={selectedFile}
            isLoading={isLoadingSimilarChunks}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* File Viewer */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedFile ? (
            <FilePreview file={selectedFile} />
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
