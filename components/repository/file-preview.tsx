"use client";

import { getFileContent } from "@/app/actions/github";
import { SearchResultFile } from "@/types/search-result";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import FilePreviewSkeleton from "../skeleton/file-preview-skeleton";
import { Alert, AlertDescription } from "../ui/alert";

interface FilePreviewProps {
  file: SearchResultFile | null;
  isLoading?: boolean;
}

export function FilePreview({ file, isLoading }: FilePreviewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loadingGithubFileContent, setLoadingGithubFileContent] =
    useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
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

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">
            {file.filepath.split("/").pop()}
          </h3>
          <p className="text-xs text-muted-foreground">{file.filepath}</p>
        </div>
      </div>

      {/* File Content */}
      <div className="relative">
        <pre className="p-4 rounded-lg bg-secondary/50 overflow-x-auto">
          <code className="text-sm">{content}</code>
        </pre>
      </div>

      {/* Similar Chunks */}
      {file.similarChunks && file.similarChunks.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Similar Chunks</h4>
          <div className="space-y-2">
            {file.similarChunks.map((chunk, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-primary/10 border border-primary/20"
              >
                <pre className="text-sm whitespace-pre-wrap">
                  {chunk.content}
                </pre>
                <div className="mt-1 text-xs text-muted-foreground">
                  Similarity: {(chunk.similarity * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
