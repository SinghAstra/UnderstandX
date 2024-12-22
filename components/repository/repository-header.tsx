import {
  AlertCircle,
  BookOpen,
  Eye,
  GitFork,
  Share2,
  Star,
} from "lucide-react";
import React from "react";
import { Icons } from "../Icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const RepositoryHeader = () => {
  const repoInfo = {
    name: "semantic-search",
    owner: "johnDoe",
    stars: 128,
    watchers: 45,
    forks: 23,
    description: "A semantic search engine for code repositories",
    language: "TypeScript",
    license: "MIT",
    lastUpdated: "Updated 2 days ago",
  };

  return (
    <header className="border-b border-border relative overflow-hidden">
      <div className="container mx-auto p-6 relative">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Icons.logo className="h-8 w-8 text-primary" />
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {repoInfo.owner}
                </span>
                <span className="text-muted-foreground">/</span>
                <h1 className="text-2xl font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                  {repoInfo.name}
                </h1>
                <Badge variant="secondary" className="ml-2">
                  Public
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {repoInfo.description}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="space-x-2">
              <Eye className="h-4 w-4" />
              <span>Watch</span>
              <Badge variant="secondary" className="ml-1">
                {repoInfo.watchers}
              </Badge>
            </Button>
            <Button variant="outline" size="sm" className="space-x-2">
              <GitFork className="h-4 w-4" />
              <span>Fork</span>
              <Badge variant="secondary" className="ml-1">
                {repoInfo.forks}
              </Badge>
            </Button>
            <Button variant="outline" size="sm" className="space-x-2">
              <Star className="h-4 w-4" />
              <span>Star</span>
              <Badge variant="secondary" className="ml-1 bg-primary/20">
                {repoInfo.stars}
              </Badge>
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-sm text-muted-foreground">
              {repoInfo.lastUpdated}
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
