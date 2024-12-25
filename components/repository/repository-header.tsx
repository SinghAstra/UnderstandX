import useRepository from "@/hooks/use-repository";
import { AlertCircle, BookOpen, Eye, GitFork, Star } from "lucide-react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import React from "react";
import { Icons } from "../Icons";
import RepositoryHeaderSkeleton from "../skeleton/repository-header-skeleton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const RepositoryHeader = () => {
  const params = useParams();
  const { repositoryInfo, loading, error } = useRepository(
    params.repositoryId as string
  );
  const repository = repositoryInfo?.repository;
  const stats = repositoryInfo?.githubStats;

  if (loading) {
    return <RepositoryHeaderSkeleton />;
  }

  if (error || !repository) {
    notFound();
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
      <div className="container mx-auto px-3 py-6 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-3">
            <a href={repository.url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center space-x-2">
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
                <span className="cursor-pointer">{repository.owner}</span>
                <span className="text-muted-foreground">/</span>
                <h1 className="text-foreground">{repository.name}</h1>
                <Badge variant="secondary" className="ml-2">
                  Public
                </Badge>
              </div>
            </a>
            <a
              href={githubUrls.issues}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="space-x-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                Issues
              </Button>
            </a>
            <a href={githubUrls.wiki} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="space-x-2">
                <BookOpen className="h-4 w-4 mr-2" />
                Wiki
              </Button>
            </a>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {repository.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <a href={githubUrls.watch} target="_blank" rel="noopener noreferrer">
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
    </header>
  );
};

export default RepositoryHeader;
