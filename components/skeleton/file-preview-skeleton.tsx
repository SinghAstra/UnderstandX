import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

function FilePreviewSkeleton() {
  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Match Navigation Skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center space-x-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <ScrollArea className="flex-1 rounded-md border">
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-9/12" />
        </div>
      </ScrollArea>

      {/* Match Info Skeleton */}
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export default FilePreviewSkeleton;
