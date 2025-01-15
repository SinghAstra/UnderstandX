"use client";
import { useRepository } from "@/components/context/repository";
import RepositoryNotFound from "@/components/not-found/repo";
import FilePreview from "@/components/repository/file-preview";
import { RepositoryProcessing } from "@/components/repository/repository-processing";
import { SearchResults } from "@/components/repository/search-results";
import {
  formatRepoName,
  SearchContainer,
} from "@/components/semantic-search-repo/search-container";
import { SearchModal } from "@/components/semantic-search-repo/search-modal";
import { RepositoryLoading } from "@/components/skeleton/repo-loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SearchResultFile, SimilarChunk } from "@/interfaces/search-result";
import { Repository } from "@prisma/client";
import { Search } from "lucide-react";
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
  const { toast } = useToast();
  const { state } = useRepository();

  // current states
  const searchQuery = searchParams.get("q") || "";
  const selectedFilePath = searchParams.get("file") || "";
  const repositoryId = params.id;

  // URL Query
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Repository State
  const [repository, setRepository] = useState<Repository>();
  const [isLoadingRepository, setIsLoadingRepository] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search results states
  const [similarChunks, setSimilarChunks] = useState<SimilarChunk[]>([]);
  const [isLoadingSimilarChunks, setIsLoadingSimilarChunks] = useState(false);

  useEffect(() => {
    const fetchRepository = async () => {
      if (!repositoryId) {
        setError("Repository ID is required");
        return;
      }

      try {
        setIsLoadingRepository(true);
        const response = await fetch(`/api/repository/${repositoryId}`);

        if (!response.ok) {
          console.log("response.status is ", response.status);
          return;
        }

        const data = await response.json();
        setRepository(data.repository);
      } catch (error) {
        console.log("Repository fetch error:", error);
        setError(
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
    if (!searchQuery || !repositoryId || !repository) return;

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
  }, [searchQuery, repositoryId, repository, router]);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
      });
    }
  }, [toast, error]);

  // Keep search value in sync with URL
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  // Group search results by file
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
    setIsSearchModalOpen(false);
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

  if (isLoadingRepository) {
    return <RepositoryLoading />;
  }

  if (!repository) {
    return <RepositoryNotFound />;
  }

  // Check both local repository status and context status
  const currentStatus =
    state.processingStatuses[repository.id] || repository.status;
  if (currentStatus !== "SUCCESS") {
    return <RepositoryProcessing repository={repository} />;
  }

  // Initial UI - Centered search when no query
  if (!searchQuery) {
    return <SearchContainer onSearch={handleSearch} repository={repository} />;
  }

  // Search results view with split pane
  return (
    <div className="flex flex-col  h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between p-2 border-b backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Avatar className="ring-2 ring-border shadow-lg">
            {repository.avatarUrl && <AvatarImage src={repository.avatarUrl} />}
            <AvatarFallback className="text-lg">
              {repository.name[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="tracking-tight">
            {repository.fullName && formatRepoName(repository.fullName)}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative w-96">
            <Input
              type="text"
              placeholder="Search code..."
              className="w-full pl-10 pr-4"
              value={searchValue}
              onClick={() => setIsSearchModalOpen(true)}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File List */}
        <div
          className={`
            overflow-y-auto p-4
            transition-all duration-300 ease-in-out
            ${selectedFile ? "w-96 border-r" : "max-w-lg w-full mx-auto"}
          `}
        >
          <SearchResults
            searchResultUniqueFiles={Object.values(groupedResults)}
            selectedFile={selectedFile}
            isLoading={isLoadingSimilarChunks}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* File Viewer */}
        <div
          className={`
          overflow-y-auto p-4
          transition-all duration-300 ease-in-out
          ${selectedFile ? "flex-1 opacity-100" : "w-0 opacity-0"}
        `}
        >
          {selectedFile && <FilePreview file={selectedFile} />}
        </div>
      </div>
      <SearchModal
        isOpen={isSearchModalOpen}
        value={searchQuery}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default RepositoryPage;
