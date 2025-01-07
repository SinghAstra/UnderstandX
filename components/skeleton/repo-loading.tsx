import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function RepositoryLoading() {
  return (
    <div className="relative w-full max-w-2xl border h-full mx-auto mt-10 rounded-md bg-card/50">
      <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center space-y-6 p-8">
        {/* Loader with glowing effect */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gray/20 blur animate-pulse" />
          <div className="relative rounded-full bg-card p-3 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            Loading Repository
          </h3>
          <p className="text-sm text-muted-foreground">
            Fetching repository details and metadata...
          </p>
        </div>

        {/* Loading skeletons with staggered animation */}
        <div className="w-full space-y-4 pt-4">
          <Skeleton className="h-4 w-3/4 mx-auto animate-pulse" />
          <Skeleton className="h-4 w-1/2 mx-auto animate-pulse delay-150" />
          <Skeleton className="h-4 w-2/3 mx-auto animate-pulse delay-300" />

          <div className="grid grid-cols-3 gap-4 pt-6">
            <Skeleton className="h-8 rounded-md animate-pulse delay-500" />
            <Skeleton className="h-8 rounded-md animate-pulse delay-700" />
            <Skeleton className="h-8 rounded-md animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </div>
  );
}
