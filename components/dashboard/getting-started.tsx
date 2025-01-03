"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { GitBranch, Search } from "lucide-react";

export function GettingStarted() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl leading-tight mb-2">
          Getting Started with {siteConfig.name}
        </h1>
        <p className="text-muted-foreground">
          Follow these steps to start exploring your code semantically.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <GitBranch className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Connect Your First Repository</CardTitle>
            <CardDescription>
              Link your GitHub repository to start exploring.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 mb-4 text-sm text-muted-foreground">
              <li>Select a repository to connect</li>
              <li>Grant necessary permissions</li>
              <li>Wait for initial indexing</li>
            </ul>
            <Button className="w-full">Connect Now</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Search className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Performing Semantic Search</CardTitle>
            <CardDescription>
              Learn how to search your code effectively.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 mb-4 text-sm text-muted-foreground">
              <li>Use natural language queries</li>
              <li>Filter by file types</li>
              <li>Search specific functions</li>
            </ul>
            <Button variant="outline" className="w-full">
              View Examples
            </Button>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <Zap className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Advanced Search Tips</CardTitle>
            <CardDescription>
              Master code search with advanced techniques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 mb-4 text-sm text-muted-foreground">
              <li>Advanced search operators</li>
              <li>Code context understanding</li>
              <li>Regular expressions</li>
            </ul>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </CardContent>
        </Card> */}
      </div>

      <div className="flex justify-center">
        <Button size="lg" variant="outline">
          Take the Tour
        </Button>
      </div>
    </div>
  );
}
