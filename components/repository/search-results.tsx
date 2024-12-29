"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";
import { SearchResultFile } from "@/types/search-result";
import { FileText } from "lucide-react";
import { SearchResultsSkeleton } from "../skeleton/search-results-skeleton";

interface SearchResultsProps {
  searchResultUniqueFiles: SearchResultFile[];
  selectedFile?: SearchResultFile | null;
  onFileSelect?: (file: SearchResultFile) => void;
  isLoading?: boolean;
}

export function SearchResults({
  searchResultUniqueFiles,
  selectedFile,
  onFileSelect,
  isLoading,
}: SearchResultsProps) {
  if (isLoading || !searchResultUniqueFiles || !onFileSelect) {
    return <SearchResultsSkeleton />;
  }

  console.log(
    "In SearchResults, searchResultUniqueFiles is ",
    searchResultUniqueFiles
  );
  console.log(
    "In SearchResults, searchResultUniqueFiles.length is ",
    searchResultUniqueFiles.length
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Results</h3>
        <span className="text-xs text-muted-foreground">
          {searchResultUniqueFiles.length} files with matches
        </span>
      </div>
      <div className="space-y-3">
        {searchResultUniqueFiles.map((file) => (
          <div
            key={file.filepath}
            onClick={() => onFileSelect(file)}
            className={cn(
              "group cursor-pointer rounded-lg border p-4 transition-all",
              selectedFile?.filepath === file.filepath
                ? "border-primary bg-accent"
                : "border-border/50 bg-secondary/50 hover:bg-accent hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {file.filepath.split("/").pop()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {file.similarChunks.length}{" "}
                    {file.similarChunks.length === 1 ? "match" : "matches"}
                  </span>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {file.type}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {file.filepath}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
