"use client";

import { SearchResultFile } from "@/types/search-result";
import FilePreviewSkeleton from "../skeleton/file-preview-skeleton";

interface FilePreviewProps {
  file: SearchResultFile | null;
  isLoading?: boolean;
}

export function FilePreview({ file, isLoading }: FilePreviewProps) {
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
    </div>
  );
}
