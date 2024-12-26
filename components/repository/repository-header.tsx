import { siteConfig } from "@/config/site";
import { GitFork, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Icons } from "../Icons";
import RepositoryHeaderSkeleton from "../skeleton/repository-header-skeleton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface RepositoryHeaderProps {
  repository?: {
    url: string;
    avatarUrl: string | null;
    owner: string;
    name: string;
    description: string | null;
  };
  githubStats?: {
    forks_count: number;
    stargazers_count: number;
  };
  isLoading?: boolean;
}

const RepositoryHeader = ({
  repository,
  githubStats,
  isLoading,
}: RepositoryHeaderProps) => {
  if (isLoading) {
    return <RepositoryHeaderSkeleton />;
  }

  if (!repository) {
    return null;
  }

  const githubUrls = {
    fork: `${repository.url}/fork`,
    star: `${repository.url}/stargazers`,
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Navigation Bar */}
      <div className="container mx-auto px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6 text-primary" />
              <span className="font-semibold">{siteConfig.name}</span>
            </Link>
          </div>
          <Link href="/search">
            <Button variant="outline" size="sm" className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>Connect Repository</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Repository Info */}
      <div className="container mx-auto px-3 py-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-3">
              {repository.avatarUrl ? (
                <div className="h-8 w-8 relative">
                  <Image
                    src={repository.avatarUrl}
                    alt={repository.name}
                    fill
                    sizes="32px"
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <Icons.code className="h-8 w-8 text-primary" />
              )}
              <div className="flex items-center flex-wrap gap-2">
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  <span>{repository.owner}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span>{repository.name}</span>
                </a>
                <Badge variant="secondary">Public</Badge>
              </div>
            </div>

            <p className="text-muted-foreground max-w-2xl">
              {repository.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={githubUrls.fork} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="space-x-2">
                <GitFork className="h-4 w-4" />
                <span>Fork</span>
                <Badge variant="secondary">
                  {githubStats?.forks_count ?? 0}
                </Badge>
              </Button>
            </a>
            <a href={githubUrls.star} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="space-x-2">
                <Star className="h-4 w-4" />
                <span>Star</span>
                <Badge variant="secondary" className="bg-primary/20">
                  {githubStats?.stargazers_count ?? 0}
                </Badge>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHeader;
