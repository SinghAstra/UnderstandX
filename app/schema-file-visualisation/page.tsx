"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartArea,
  ChevronRight,
  Database,
  FileCode,
  Grid,
  List,
  Search,
} from "lucide-react";
import React, { useState } from "react";

const SchemaFileSelection = () => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [previewFile, setPreviewFile] = useState<(typeof files)[0] | null>(
    null
  );

  const files = [
    {
      id: 1,
      name: "schema.prisma",
      type: "Prisma",
      size: "12KB",
      path: "/prisma/schema.prisma",
      lastModified: "2 mins ago",
      preview: 'generator client { provider = "prisma-client-js" }',
      content: `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}`,
    },
    {
      id: 2,
      name: "001_init.sql",
      type: "SQL",
      size: "8KB",
      path: "/migrations/001_init.sql",
      lastModified: "2 days ago",
      preview: "CREATE TABLE users ( id INTEGER PRIMARY KEY )",
      content: `
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bio TEXT,
    user_id INTEGER UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT FALSE,
    author_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES users (id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author ON posts(author_id);`,
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "Prisma":
        return <Database className="h-4 w-4" />;
      case "SQL":
        return <FileCode className="h-4 w-4" />;
      case "ChartArea":
        return <ChartArea className="h-4 w-4" />;
      default:
        return <FileCode className="h-4 w-4" />;
    }
  };

  const handleFileSelection = (fileId: number) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    const allFileIds = files.map((file) => file.id);
    setSelectedFiles(allFileIds);
  };

  const handleClear = () => {
    setSelectedFiles([]);
  };

  const handlePreview = (fileId: number) => {
    const file = files.find((f) => f.id === fileId);
    setPreviewFile(file || null);
  };

  const getSelectedFilesInfo = () => {
    const selectedCount = selectedFiles.length;
    const selectedSize = files
      .filter((file) => selectedFiles.includes(file.id))
      .reduce((total, file) => {
        const sizeInKB = parseInt(file.size);
        return total + sizeInKB;
      }, 0);
    return `Selected: ${selectedCount} files (${selectedSize} KB)`;
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-64 border-r p-4 flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">File Types</h3>
          <RadioGroup defaultValue="all" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <label htmlFor="all">All Types (23)</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sql" id="sql" />
              <label htmlFor="sql">SQL (12)</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prisma" id="prisma" />
              <label htmlFor="prisma">Prisma (4)</label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Directories</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="prisma-dir" />
              <label htmlFor="prisma-dir">/prisma (4)</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="migrations-dir" />
              <label htmlFor="migrations-dir">/migrations (12)</label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Project Name</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search files..." className="pl-8 w-[300px]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>{getSelectedFilesInfo()}</span>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
          <Button className="flex items-center gap-2">
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* File List/Grid */}
        <ScrollArea className="flex-1 p-4">
          {viewMode === "list" ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileSelection(file.id)}
                  className={`
                  flex items-center gap-4 p-4 border rounded-lg 
                  cursor-pointer
                  transition-colors
                  hover:bg-accent/50
                  ${selectedFiles.includes(file.id) ? "bg-accent" : ""}
                `}
                >
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    className="pointer-events-none"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getFileIcon(file.type)}
                      <span className="font-medium">{file.name}</span>
                      <Badge variant="secondary">{file.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {file.size}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {file.lastModified}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {file.path}
                    </div>
                    <div className="mt-2 p-2 bg-muted rounded text-sm font-mono">
                      {file.preview}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(file.id);
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {files.map((file) => (
                <Card key={file.id}>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Checkbox />
                    <div>
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {file.path}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{file.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {file.size}
                      </span>
                    </div>
                    <div className="p-2 bg-muted rounded text-sm font-mono">
                      {file.preview}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      {/* Preview Modal */}
      <Dialog
        open={previewFile !== null}
        onOpenChange={() => setPreviewFile(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewFile && (
                <>
                  {getFileIcon(previewFile.type)}
                  {previewFile.name}
                  <Badge variant="secondary">{previewFile.type}</Badge>
                  <span className="text-sm font-normal text-muted-foreground">
                    {previewFile.path}
                  </span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[60vh]">
            <div className="p-4 bg-muted rounded text-sm font-mono whitespace-pre">
              {previewFile?.content}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemaFileSelection;
