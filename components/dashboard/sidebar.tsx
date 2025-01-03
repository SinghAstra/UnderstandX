"use client";

import { RepositoryCard } from "@/components/repository/repository-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search } from "lucide-react";

// Mock data for demonstration
const mockRepositories = [
  {
    id: "1",
    name: "next.js",
    fullName: "vercel/next.js",
    owner: "vercel",
    avatarUrl: "https://avatars.githubusercontent.com/u/14985020?s=200&v=4",
    status: "SUCCESS",
  },
  {
    id: "2",
    name: "react",
    fullName: "facebook/react",
    owner: "facebook",
    avatarUrl: "https://avatars.githubusercontent.com/u/69631?s=200&v=4",
    status: "SUCCESS",
  },
];

export function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 w-96 bg-background border-r pt-16">
      <div className="flex flex-col">
        <div className="p-4">
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Repository
          </Button>
          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search repositories..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {mockRepositories.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
