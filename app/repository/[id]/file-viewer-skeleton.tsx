import { Skeleton } from "@/components/ui/skeleton";

export function FileViewerSkeleton() {
  return (
    <div className="ml-96 w-full p-3">
      <div className="border rounded-lg">
        <div className="border-b flex justify-between items-center py-1 px-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="p-3">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
