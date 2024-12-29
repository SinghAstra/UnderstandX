"use client";

import { getFileContent } from "@/app/actions/github";
import { cn } from "@/lib/utils/utils";
import { SearchResultFile, SimilarChunk } from "@/types/search-result";
import { AlertCircle, Code2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import FilePreviewSkeleton from "../skeleton/file-preview-skeleton";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";

interface FilePreviewProps {
  file: SearchResultFile | null;
  isLoading?: boolean;
}

interface ChunkPosition {
  chunk: SimilarChunk;
  startIndex: number;
  endIndex: number;
}

export function FilePreview({ file, isLoading }: FilePreviewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loadingGithubFileContent, setLoadingGithubFileContent] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chunkPositions, setChunkPositions] = useState<ChunkPosition[]>([]);

  const findChunkPositions = (fullContent: string, chunks: SimilarChunk[]) => {
    const positions: ChunkPosition[] = [];

    chunks.forEach((chunk) => {
      // Clean up the chunk content (remove extra whitespace)
      const cleanChunkContent = chunk.content.trim();
      const startIndex = fullContent.indexOf(cleanChunkContent);

      if (startIndex !== -1) {
        positions.push({
          chunk,
          startIndex,
          endIndex: startIndex + cleanChunkContent.length,
        });
      }
    });

    return positions.sort((a, b) => a.startIndex - b.startIndex);
  };

  const renderHighlightedContent = () => {
    if (!content) return null;

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    chunkPositions.forEach((position, index) => {
      // Add non-highlighted content before this chunk
      if (position.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`} className="text-muted-foreground">
            {content.slice(lastIndex, position.startIndex)}
          </span>
        );
      }

      // Add highlighted chunk
      parts.push(
        <span
          key={`highlight-${index}`}
          className={cn(
            "match-highlight rounded-md px-1 transition-all duration-200",
            "cursor-pointer relative group"
          )}
        >
          {content.slice(position.startIndex, position.endIndex)}
          <div className="absolute hidden group-hover:block bg-popover/95 backdrop-blur-sm p-3 rounded-lg shadow-xl -top-12 left-0 text-sm z-10 border border-border/50 min-w-[140px]">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-accent text-accent-foreground z-20"
              >
                {(position.chunk.similarity * 100).toFixed(1)}% Match
              </Badge>
            </div>
          </div>
        </span>
      );

      lastIndex = position.endIndex;
    });

    // Add any remaining content
    if (lastIndex < content.length) {
      parts.push(
        <span key="text-end" className="text-muted-foreground">
          {content.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  useEffect(() => {
    async function fetchFileContent() {
      if (!file) {
        setContent(null);
        return;
      }

      setLoadingGithubFileContent(true);
      setError(null);

      try {
        // Extract owner and repo from repositoryName (assuming format: owner/repo)
        const [owner, repo] = file.repositoryFullName.split("/");

        // Get file content using the server action
        const { content: fileContent } = await getFileContent(
          owner,
          repo,
          file.filepath
        );

        setContent(fileContent);
        setChunkPositions(findChunkPositions(fileContent, file.similarChunks));
      } catch (err) {
        setError("Failed to load file content. Please try again.");
        console.log("Error loading file: --FilePreview", err);
      } finally {
        setLoadingGithubFileContent(false);
      }
    }

    fetchFileContent();
  }, [file]);

  if (isLoading || loadingGithubFileContent) {
    return <FilePreviewSkeleton />;
  }

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground gap-3">
        <FileText className="w-8 h-8 text-muted-foreground/50" />
        <div className="text-sm">Select a file to preview</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const fileExtension = file.filepath.split(".").pop()?.toLowerCase();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-3 bg-secondary/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-primary" />
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">
              {file.filepath.split("/").pop()}
            </h3>
            <p className="text-xs text-muted-foreground">{file.filepath}</p>
          </div>
        </div>
        {fileExtension && (
          <Badge variant="secondary" className="uppercase text-xs">
            {fileExtension}
          </Badge>
        )}
      </div>

      {/* File Content */}
      <div className="relative">
        <pre className="code-preview p-4 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed">
          <code>{renderHighlightedContent()}</code>
        </pre>
      </div>
    </div>
  );
}
