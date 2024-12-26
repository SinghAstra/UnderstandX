import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GitFork, Star } from "lucide-react";
import React from "react";

const RepositoryHeaderSkeleton = () => {
  return (
    <div className="container mx-auto px-3 py-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Fork Button Skeleton */}
          <div className="inline-flex">
            <Button variant="outline" size="sm" className="space-x-2" disabled>
              <GitFork className="h-4 w-4" />
              <span>Fork</span>
              <Badge variant="secondary">-</Badge>
            </Button>
          </div>

          {/* Star Button Skeleton */}
          <div className="inline-flex">
            <Button variant="outline" size="sm" className="space-x-2" disabled>
              <Star className="h-4 w-4" />
              <span>Star</span>
              <Badge variant="secondary">-</Badge>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHeaderSkeleton;
