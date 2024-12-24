import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BookOpen, Eye, GitFork, Star } from "lucide-react";
import React from "react";

const RepositoryHeaderSkeleton = () => {
  return (
    <header className="border-b border-border relative overflow-hidden">
      <div className="container mx-auto px-3 py-6 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <span className="text-muted-foreground">/</span>
              <Skeleton className="h-4 w-32" />
              <Badge variant="secondary" className="ml-2 opacity-50">
                Public
              </Badge>
            </div>

            <Button variant="outline" size="sm" className="space-x-2" disabled>
              <AlertCircle className="h-4 w-4 mr-2" />
              Issues
            </Button>

            <Button variant="outline" size="sm" className="space-x-2" disabled>
              <BookOpen className="h-4 w-4 mr-2" />
              Wiki
            </Button>
          </div>
          <Skeleton className="h-4 w-[32rem] mt-2" />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="space-x-2" disabled>
            <Eye className="h-4 w-4" />
            <span>Watch</span>
            <Badge variant="secondary" className="ml-1">
              -
            </Badge>
          </Button>

          <Button variant="outline" size="sm" className="space-x-2" disabled>
            <GitFork className="h-4 w-4" />
            <span>Fork</span>
            <Badge variant="secondary" className="ml-1">
              -
            </Badge>
          </Button>

          <Button variant="outline" size="sm" className="space-x-2" disabled>
            <Star className="h-4 w-4" />
            <span>Star</span>
            <Badge variant="secondary" className="ml-1 bg-primary/20">
              -
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default RepositoryHeaderSkeleton;
