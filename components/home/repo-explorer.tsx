"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import {
  BookOpen,
  FileText,
  FolderOpen,
  GitBranch,
  Search,
} from "lucide-react";
import { WindowControls } from "./window-controls";

export function RepoExplorer() {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/50 to-purple-500/50 opacity-75 blur"></div>
      <div className="relative rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-medium">
              Get Started |{" "}
              <span className="text-primary">{siteConfig.name}</span>
            </span>
          </div>
          <WindowControls />
        </div>

        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Start Exploring..." className="pl-9 pr-4" />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button variant="secondary" size="sm" className="text-xs">
              <FileText className="mr-1 h-3 w-3" /> README.md
            </Button>
            <Button variant="secondary" size="sm" className="text-xs">
              <FolderOpen className="mr-1 h-3 w-3" /> docs/
            </Button>
            <Button variant="secondary" size="sm" className="text-xs">
              <GitBranch className="mr-1 h-3 w-3" /> main
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
