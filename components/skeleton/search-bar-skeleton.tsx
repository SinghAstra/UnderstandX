import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function SearchBarSkeleton() {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 h-5 w-5">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
      <Skeleton className="w-full h-12 rounded-md" />
    </div>
  );
}
