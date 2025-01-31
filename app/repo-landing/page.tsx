"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeIcon, FileIcon, FolderIcon, SearchIcon } from "lucide-react";
import React, { useState } from "react";

interface Feature {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface File {
  id: string;
  name: string;
  path: string;
  updatedAt: Date;
  summary?: string;
}

interface Directory {
  id: string;
  path: string;
  summary: string;
  children: Directory[];
  files: File[];
}

interface Repository {
  name: string;
  owner: string;
  avatarUrl: string;
  summary: string;
  status: string;
  technologies?: string[];
}

interface FeaturesByCategory {
  [key: string]: Feature[];
}

const sampleData = {
  repository: {
    name: "next-auth",
    owner: "nextjs-auth",
    summary: "A complete authentication solution for Next.js applications.",
    status: "SUCCESS",
  } as Repository,
  directories: [
    {
      id: "1",
      path: "src",
      summary: "Core source code containing authentication implementations",
      children: [],
      files: [
        {
          id: "1",
          name: "index.ts",
          path: "src/index.ts",
          summary: "Main entry point, exports core authentication functions",
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "auth.ts",
          path: "src/auth.ts",
          summary: "Authentication logic implementation",
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: "2",
      path: "docs",
      summary: "Documentation and usage examples",
      children: [],
      files: [
        {
          id: "3",
          name: "getting-started.md",
          path: "docs/getting-started.md",
          summary: "Getting started guide and basic setup instructions",
          updatedAt: new Date(),
        },
      ],
    },
  ] as Directory[],
  features: [
    {
      id: "1",
      name: "OAuth Authentication",
      category: "Authentication",
      description: "Implements OAuth 2.0 flow with multiple providers",
    },
    {
      id: "2",
      name: "JWT Sessions",
      category: "Authentication",
      description: "Secure session management using JWT tokens",
    },
    {
      id: "3",
      name: "Database Integration",
      category: "Backend",
      description: "Flexible database adapters for user storage",
    },
    {
      id: "4",
      name: "Email Verification",
      category: "Security",
      description: "Built-in email verification flow",
    },
  ] as Feature[],
};

const RepositoryLanding = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{
    type: "file" | "directory";
    id: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {sampleData.repository.owner}/{sampleData.repository.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {sampleData.repository.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container py-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              selectedFeature
                ? `Search for "${selectedFeature.name}" implementation...`
                : "Search for functionality..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6 mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Directory Tree */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-4">
                <ScrollArea className="h-[600px]">
                  {sampleData.directories.map((dir) => (
                    <div key={dir.id} className="py-2">
                      <div
                        className="flex items-center gap-2 hover:bg-accent p-2 rounded-md cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredItem({ type: "directory", id: dir.id })
                        }
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <FolderIcon className="w-4 h-4" />
                        <span>{dir.path}</span>
                      </div>
                      {hoveredItem?.type === "directory" &&
                        hoveredItem.id === dir.id && (
                          <div className="ml-6 mt-1 text-sm text-muted-foreground">
                            {dir.summary}
                          </div>
                        )}
                      {dir.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2 hover:bg-accent p-2 rounded-md cursor-pointer ml-4"
                          onMouseEnter={() =>
                            setHoveredItem({ type: "file", id: file.id })
                          }
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <FileIcon className="w-4 h-4" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Middle: Features */}
          <div className="col-span-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CodeIcon className="w-5 h-5" />
                  Features & Functionality
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-6">
                  {Object.entries(
                    sampleData.features.reduce<FeaturesByCategory>(
                      (acc, feature) => {
                        if (!acc[feature.category]) {
                          acc[feature.category] = [];
                        }
                        acc[feature.category].push(feature);
                        return acc;
                      },
                      {}
                    )
                  ).map(([category, features]) => (
                    <div key={category}>
                      <h3 className="font-medium mb-3">{category}</h3>
                      <div className="space-y-3">
                        {features.map((feature) => (
                          <div
                            key={feature.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedFeature?.id === feature.id
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-accent"
                            }`}
                            onClick={() => {
                              setSelectedFeature(feature);
                              setSearchQuery(feature.name);
                            }}
                          >
                            <div className="font-medium mb-1">
                              {feature.name}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryLanding;
