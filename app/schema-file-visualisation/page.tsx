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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartArea,
  CheckSquare,
  ChevronRight,
  Database,
  FileCode,
  Grid,
  List,
  Search,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

const TopBar = ({
  searchQuery,
  setSearchQuery,
  projectName,
  activeView,
  setActiveView,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  projectName: string;
  activeView: string;
  setActiveView: (view: string) => void;
}) => (
  <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 p-4 flex items-center justify-between">
    <h2 className="text-xl font-bold">{projectName}</h2>
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files..."
          className="pl-8 w-[300px]"
        />
      </div>

      <Tabs
        value={activeView}
        onValueChange={setActiveView}
        className="w-[100px] rounded-md"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">
            <List className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="grid">
            <Grid className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </div>
);

const ActionBar = ({
  selectedCount,
  selectedSize,
  onContinue,
}: {
  selectedCount: number;
  selectedSize: number;
  onContinue: () => void;
}) => (
  <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-[73px] z-10 p-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      {selectedCount > 0 ? (
        <>
          <span className="font-medium">{selectedCount} files selected</span>
          <Separator orientation="vertical" className="h-6" />
          <span className="text-muted-foreground">
            Total size: {selectedSize} KB
          </span>
        </>
      ) : (
        <span className="text-muted-foreground">No files selected</span>
      )}
    </div>
    <Button
      className="gap-2"
      disabled={selectedCount === 0}
      onClick={onContinue}
    >
      Continue
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

const SchemaFileSelection = () => {
  const [activeView, setActiveView] = useState("list");
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [previewFile, setPreviewFile] = useState<(typeof files)[0] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const files = [
    {
      id: 1,
      name: "schema.prisma",
      type: "Prisma",
      size: "12KB",
      path: "/prisma/schema.prisma",
      lastModified: "2 mins ago",
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

  const handleClearAll = () => {
    setSelectedFiles([]);
  };

  const handlePreview = (fileId: number) => {
    const file = files.find((f) => f.id === fileId);
    setPreviewFile(file || null);
  };

  const getTotalSelectedSize = () => {
    return files
      .filter((file) => selectedFiles.includes(file.id))
      .reduce((total, file) => {
        const sizeInKB = parseInt(file.size);
        return total + sizeInKB;
      }, 0);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen bg-background flex"
    >
      {/* Left Sidebar */}
      <ResizablePanel
        className="border-r p-4 flex flex-col gap-6"
        defaultSize={20}
        minSize={15}
        maxSize={30}
      >
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">File Types</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={
                selectedFiles.length === 0 ? handleSelectAll : handleClearAll
              }
            >
              {selectedFiles.length === 0 ? (
                <span className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Select All
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </span>
              )}
            </Button>
          </div>
          <RadioGroup
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value);
              setSelectedFiles([]);
            }}
            className="space-y-2"
          >
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
      </ResizablePanel>
      <ResizableHandle withHandle />

      {/* Main Content */}
      <ResizablePanel
        className="flex-1 flex flex-col"
        minSize={70}
        defaultSize={80}
      >
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          projectName="Project Name"
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <ActionBar
          selectedCount={selectedFiles.length}
          selectedSize={getTotalSelectedSize()}
          onContinue={() => {}}
        />

        {/* File List/Grid */}
        <ScrollArea className="flex-1 p-4">
          <Tabs value={activeView} className="w-full">
            <TabsContent value="list" className="mt-0">
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
                        <Badge>{file.type}</Badge>
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
            </TabsContent>
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-3 gap-4">
                {files.map((file) => (
                  <Card key={file.id}>
                    <CardHeader className="flex flex-row items-center gap-2">
                      <Checkbox />
                      <div>
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <span className="font-medium ">{file.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {file.path}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{file.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {file.size}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </ResizablePanel>
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
    </ResizablePanelGroup>
  );
};

export default SchemaFileSelection;
