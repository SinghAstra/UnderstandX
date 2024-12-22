"use client";

import { Icons } from "@/components/Icons";
import RepositoryHeader from "@/components/repository/repository-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  BookOpen,
  Code,
  Eye,
  FileText,
  GitBranch,
  GitFork,
  History,
  Search,
  Settings,
  Share2,
  Star,
} from "lucide-react";
import React, { useState } from "react";

const RepositoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedFileType, setSelectedFileType] = useState("all");

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
    <div className="min-h-screen bg-background">
      <RepositoryHeader />

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Search and Filters Section */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="bg-input pl-10 text-foreground placeholder:text-muted-foreground"
              placeholder="Search code, functions, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-40 bg-input">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedFileType}
              onValueChange={setSelectedFileType}
            >
              <SelectTrigger className="w-40 bg-input">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="docs">Documentation</SelectItem>
                <SelectItem value="config">Configuration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results and Preview Section */}
        <div className="grid grid-cols-12 gap-6">
          {/* Results List */}
          <div className="col-span-5">
            <Card className="bg-card">
              <CardContent className="p-4">
                <SearchResults />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="col-span-7">
            <Card className="bg-card">
              <CardContent className="p-4">
                <FilePreview />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const SearchResults = () => {
  const results = [
    {
      id: 1,
      fileName: "SearchEngine.ts",
      path: "src/lib/search",
      language: "TypeScript",
      preview: "export class SearchEngine implements ISearchEngine {",
      matches: ["search", "engine"],
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Results</h3>
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="cursor-pointer rounded-lg border border-border bg-secondary p-3 transition-colors hover:bg-accent"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {result.fileName}
                </span>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {result.language}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{result.path}</p>
            <pre className="mt-2 rounded bg-background p-2 text-sm text-foreground">
              {result.preview}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

const FilePreview = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium text-foreground">SearchEngine.ts</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </div>

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <pre className="mt-4 rounded-lg bg-background p-4 text-foreground">
            {`export class SearchEngine implements ISearchEngine {
  private index: SearchIndex;
              
  constructor() {
    this.index = new SearchIndex();
  }
              
  public async search(query: string): Promise<SearchResult[]> {
    // Implementation
  }
}`}
          </pre>
        </TabsContent>
        <TabsContent value="preview">
          <div className="mt-4 rounded-lg border border-border p-4 text-foreground">
            <p>Rendered preview of the file (if applicable)</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RepositoryPage;
