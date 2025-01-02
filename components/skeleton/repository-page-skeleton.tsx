import React from "react";
import FilePreview from "../repository/file-preview";
import RepositoryHeader from "../repository/repository-header";
import { SearchBar } from "../repository/search-bar";
import { SearchResults } from "../repository/search-results";
import { Card, CardContent } from "../ui/card";

interface RepositoryPageSkeletonProps {
  loadingRepositoryInfo: boolean;
}

const RepositoryPageSkeleton = ({
  loadingRepositoryInfo,
}: RepositoryPageSkeletonProps) => {
  return (
    <div className="min-h-screen bg-background">
      <RepositoryHeader isLoading={loadingRepositoryInfo} />
      <main className="container mx-auto  flex flex-col gap-2 py-2 animate-in fade-in">
        <SearchBar isLoading={loadingRepositoryInfo} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-5">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <SearchResults isLoading={loadingRepositoryInfo} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-7">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <FilePreview isLoading={loadingRepositoryInfo} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryPageSkeleton;
