"use client";

import {
  ChevronDown,
  ChevronRight,
  Copy,
  FileCode,
  Folder,
  GitFork,
  Search,
  Star,
} from "lucide-react";
import React, { useState } from "react";

// Mock data based on the schema
const repositoryData = {
  id: "1",
  name: "next-auth",
  fullName: "nextauthjs/next-auth",
  description: "Authentication for Next.js",
  status: "SUCCESS",
  owner: "nextauthjs",
  url: "https://github.com/nextauthjs/next-auth",
  avatarUrl: "/api/placeholder/40/40",
  chunks: [
    {
      id: "chunk1",
      filepath: "src/core/index.ts",
      content: "export function NextAuth() { /* ... */ }",
      type: "typescript",
      keywords: ["auth", "next-auth", "core"],
    },
    // More chunks...
  ],
};

const RepositoryDetailView = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <Image
              src={repositoryData.avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full"
            /> */}
            <div>
              <div className="text-sm text-muted-foreground">
                {repositoryData.owner} /
                <span className="font-semibold text-foreground">
                  {" "}
                  {repositoryData.name}
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search code semantically..."
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto  py-2">
        {/* Three Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* File Tree */}
          <div className="col-span-3 border-r border-border">
            <div className="space-y-1">
              <FileTreeItem name="src" type="folder" level={0} expanded />
              <FileTreeItem name="core" type="folder" level={1} />
              <FileTreeItem name="index.ts" type="file" level={2} />
            </div>
          </div>

          {/* Code View */}
          <div className="col-span-9 bg-card rounded-lg p-4">
            <div className="border-b border-border pb-3 mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode size={16} className="text-primary" />
                <span className="text-sm font-medium">src/core/index.ts</span>
              </div>
              <button className="p-1 hover:bg-secondary rounded-md transition-colors">
                <Copy size={16} className="text-muted-foreground" />
              </button>
            </div>
            <pre className="font-mono text-sm">
              <code>{repositoryData.chunks[0].content}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

// File Tree Item Component
const FileTreeItem = ({ name, type, level, expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div
      className="flex items-center space-x-1 px-2 py-1 hover:bg-secondary rounded-md cursor-pointer text-sm"
      style={{ paddingLeft: `${level * 1.5}rem` }}
    >
      {type === "folder" && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      )}
      {type === "folder" ? (
        <Folder size={16} className="text-primary" />
      ) : (
        <FileCode size={16} className="text-muted-foreground" />
      )}
      <span>{name}</span>
    </div>
  );
};

export default RepositoryDetailView;
