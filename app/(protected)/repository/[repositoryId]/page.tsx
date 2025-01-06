"use client";
import FilePreview from "@/components/repository/file-preview";
import { SearchResults } from "@/components/repository/search-results";
import { SearchContainer } from "@/components/semantic-search-repo/search-container";
import { SearchResultFile, SimilarChunk } from "@/interfaces/search-result";
import { Repository } from "@prisma/client";
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

  // current states
  const searchQuery = searchParams.get("q") || "";
  const selectedFilePath = searchParams.get("file") || "";
  const repositoryId = params.repositoryId;

  // Repository State
  const [repository, setRepository] = useState<Repository | null>(null);
  const [isLoadingRepository, setIsLoadingRepository] = useState(true);
  const [repositoryError, setRepositoryError] = useState<string | null>(null);

  const [similarChunks, setSimilarChunks] = useState<SimilarChunk[]>([]);
  const [isLoadingSimilarChunks, setIsLoadingSimilarChunks] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      if (!repositoryId) {
        setRepositoryError("Repository ID is required");
        setIsLoadingRepository(false);
        return;
      }

      try {
        const response = await fetch(`/api/repository/${repositoryId}`);

        if (!response.ok) {
          console.log("response.status is ", response.status);
          if (response.status === 404) {
            router.push("/404");
            return;
          }
          throw new Error("Failed to fetch repository");
        }

        const data = await response.json();
        setRepository(data);
      } catch (error) {
        console.log("Repository fetch error:", error);
        setRepositoryError(
          error instanceof Error
            ? error.message
            : "Failed to fetch repository details"
        );
      } finally {
        setIsLoadingRepository(false);
      }
    };

    fetchRepository();
  }, [repositoryId, router]);

  useEffect(() => {
    console.log("In the useEffect.");
    console.log("searchQuery is ", searchQuery);
    console.log("repositoryId is ", repositoryId);
    if (!searchQuery || !repositoryId || !repository) return;

    const fetchSimilarChunks = async () => {
      setIsLoadingSimilarChunks(true);
      setSearchError(null);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
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
        setSearchError(
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
  }, [searchQuery, repositoryId, repository, router]);

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
  if (!searchQuery) {
    return <SearchContainer onSearch={handleSearch} />;
  }

  console.log("groupedResults is ", groupedResults);
  console.log("isLoadingSimilarChunks is ", isLoadingSimilarChunks);

  if (isLoadingRepository) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (repositoryError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-destructive">{repositoryError}</div>
      </div>
    );
  }

  if (!repository) {
    return null;
  }

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
