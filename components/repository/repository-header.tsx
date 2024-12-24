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
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Icons } from "../Icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const RepositoryHeader = () => {
  const router = useRouter();
  const params = useParams();
  const { repositoryInfo, loading, error } = useRepository(
    params.repositoryId as string
  );
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

  if (error || !repository) {
    router.push("/dashboard");
    return null;
  }

  const githubUrls = {
    watch: `${repository.url}/watchers`,
    fork: `${repository.url}/fork`,
    star: `${repository.url}/stargazers`,
    issues: `${repository.url}/issues`,
    wiki: `${repository.url}/wiki`,
  };

  return (
    <header className="border-b border-border relative overflow-hidden">
      <div className="container mx-auto p-6 relative">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            {/* TODO: Make this link to github repo url with target blank */}
            <a href={repository.url} target="_blank" rel="noopener noreferrer">
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
                  <Icons.logo className="h-8 w-8 text-primary" />
                )}
                <div className="flex items-center space-x-2">
                  <span className="cursor-pointer">{repository.owner}</span>
                  <span className="text-muted-foreground">/</span>
                  <h1 className="text-foreground">{repository.name}</h1>
                  <Badge variant="secondary" className="ml-2">
                    Public
                  </Badge>
                </div>
              </div>
            </a>
            <p className="text-muted-foreground max-w-2xl">
              {repository.description}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={githubUrls.watch}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="space-x-2">
                <Eye className="h-4 w-4" />
                <span>Watch</span>
                <Badge variant="secondary" className="ml-1">
                  {stats?.watchers_count ?? 0}
                </Badge>
              </Button>
            </a>
            <a href={githubUrls.fork} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="space-x-2">
                <GitFork className="h-4 w-4" />
                <span>Fork</span>
                <Badge variant="secondary" className="ml-1">
                  {stats?.forks_count ?? 0}
                </Badge>
              </Button>
            </a>
            <a href={githubUrls.star} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="space-x-2">
                <Star className="h-4 w-4" />
                <span>Star</span>
                <Badge variant="secondary" className="ml-1 bg-primary/20">
                  {stats?.stargazers_count ?? 0}
                </Badge>
              </Button>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <a
              href={githubUrls.issues}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Issues
              </Button>
            </a>
            <a href={githubUrls.wiki} target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Wiki
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RepositoryHeader;
