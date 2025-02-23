import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, FileText, Folder } from "lucide-react";
import React from "react";

const DirectorySkeleton = ({ level = 0 }) => {
  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-2 py-1 px-2"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <ChevronRight size={16} className="text-muted-foreground opacity-50" />
        <Folder size={16} className="text-muted-foreground opacity-50" />
        <Skeleton className="h-4 w-32" />
      </div>
      {level < 2 && (
        <div>
          <FileSkeleton level={level + 1} />
          <FileSkeleton level={level + 1} />
          {level === 0 && <DirectorySkeleton level={level + 1} />}
        </div>
      )}
    </div>
  );
};

const FileSkeleton = ({ level = 0 }) => (
  <div
    className="flex items-center gap-2 py-1 px-2"
    style={{ paddingLeft: `${level * 16 + 24}px` }}
  >
    <FileText size={16} className="text-muted-foreground opacity-50" />
    <Skeleton className="h-4 w-24" />
  </div>
);

const RepositorySkeleton = () => {
  return (
    <div className="mt-20">
      <div className="border border-border rounded-lg overflow-hidden bg-card mx-auto w-full max-w-2xl p-3">
        <div className="space-y-4">
          {/* File Structure */}
          <DirectorySkeleton />
          <FileSkeleton />
          <DirectorySkeleton />
          <FileSkeleton />
        </div>
      </div>
    </div>
  );
};

export default RepositorySkeleton;
