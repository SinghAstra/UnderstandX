import { Skeleton } from "@/components/ui/skeleton";

export function SidebarRepoHeaderSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-8 w-full" /> {/* Button skeleton */}
      <div className="relative mt-2">
        <Skeleton className="h-9 w-full" /> {/* Input skeleton */}
      </div>
    </div>
  );
}
