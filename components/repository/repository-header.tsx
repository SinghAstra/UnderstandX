import useRepository from "@/hooks/use-repository";
import {
  AlertCircle,
  BookOpen,
  Eye,
  GitFork,
  Share2,
  Star,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { Icons } from "../Icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";

const RepositoryHeader = () => {
  const params = useParams();
  const { repositoryInfo, loading, error } = useRepository(params.repositoryId as string); 
  const repository = repositoryInfo?.repository;
  const stats = repositoryInfo?.githubStats;

  if (loading) {
    return (
      <header className="border-b border-border relative overflow-hidden">
        <div className="container mx-auto p-6 relative">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-4 w-96 bg-muted rounded" />
          </div>
        </div>
      </header>
    );
  }

  // TODO:In case error occurs i want to show toast and redirect to the dashboard page
  if (error || !repository) {
    return (
      <header className="border-b border-border relative overflow-hidden">
        <div className="container mx-auto p-6 relative">
          <div className="text-destructive">
            Error loading repository details
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border relative overflow-hidden">
      <div className="container mx-auto p-6 relative">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 h-8 w-8 relative">
              {repository.avatarUrl ? (
                <Image
                  src={repository.avatarUrl}
                  alt={repository.name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <Icons.logo className="h-8 w-8 text-primary" />
              )}
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {repository.owner}
                </span>
                <span className="text-muted-foreground">/</span>
                <h1 className="text-2xl font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                  {repository.name}
                </h1>
                <Badge variant="secondary" className="ml-2">
                  Public
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {repository.description}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="space-x-2">
              <Eye className="h-4 w-4" />
              <span>Watch</span>
              <Badge variant="secondary" className="ml-1">
                {stats?.watchers_count ?? 0}
              </Badge>
            </Button>
            <Button variant="outline" size="sm" className="space-x-2">
              <GitFork className="h-4 w-4" />
              <span>Fork</span>
              <Badge variant="secondary" className="ml-1">
                {stats?.forks_count ?? 0}
              </Badge>
            </Button>
            <Button variant="outline" size="sm" className="space-x-2">
              <Star className="h-4 w-4" />
              <span>Star</span>
              <Badge variant="secondary" className="ml-1 bg-primary/20">
                {stats?.stargazers_count ?? 0}
              </Badge>
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-sm text-muted-foreground">
              Status: {repository.status}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Issues
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Wiki
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RepositoryHeader;
