"use client";

import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface SearchResult {
  id: number;
  fileName: string;
  path: string;
  language: string;
  preview: string;
  matches: string[];
}

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Results</h3>
        <span className="text-xs text-muted-foreground">
          {results.length} matches
        </span>
      </div>
      <div className="space-y-3">
        {results.map((result) => (
          <div
            key={result.id}
            className="group cursor-pointer rounded-lg border border-border/50 bg-secondary/50 p-4 transition-all hover:bg-accent hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">
                  {result.fileName}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {result.language}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{result.path}</p>
            <pre className="mt-3 rounded-md bg-background/50 p-3 text-sm text-foreground border border-border/50">
              {result.preview}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
