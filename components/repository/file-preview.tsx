"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import FilePreviewSkeleton from "../skeleton/file-preview-skeleton";

interface Match {
  id: string;
  content: string;
  similarity: number;
}

interface FilePreviewProps {
  file?: {
    filepath: string;
    type: string;
    repositoryName: string;
    matches: Match[];
  } | null;
  isLoading?: boolean;
}

export function FilePreview({ file, isLoading }: FilePreviewProps) {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  if (isLoading) {
    return <FilePreviewSkeleton />;
  }

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
        <div className="text-sm">Select a file to preview</div>
      </div>
    );
  }

  const { matches, filepath } = file;
  const currentMatch = matches[currentMatchIndex];

  const handlePreviousMatch = () => {
    setCurrentMatchIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextMatch = () => {
    setCurrentMatchIndex((prev) =>
      prev < matches.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">{filepath.split("/").pop()}</h3>
          <p className="text-xs text-muted-foreground">{filepath}</p>
        </div>

        {/* Match Navigation */}
        {matches.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Match {currentMatchIndex + 1} of {matches.length}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMatch}
                disabled={currentMatchIndex === 0}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMatch}
                disabled={currentMatchIndex === matches.length - 1}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 rounded-md border">
        <div className="p-4">
          <pre
            className="text-sm whitespace-pre-wrap font-mono"
            dangerouslySetInnerHTML={{
              __html: currentMatch.content,
            }}
          />
        </div>
      </ScrollArea>

      {/* Match Info */}
      <div className="mt-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            Match Similarity: {(currentMatch.similarity * 100).toFixed(1)}%
          </span>
          <span>Match ID: {currentMatch.id}</span>
        </div>
      </div>
    </div>
  );
}
