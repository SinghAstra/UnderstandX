"use client";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Repository } from "@prisma/client";
import { Code, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  if (repositories.length > 0) {
    console.log("repositories[0].status is ", repositories[0].status);
  }

  const fetchRepositories = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(status && { status }),
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await fetch(`/api/repository?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch repositories.");
      }
      const data = await response.json();
      console.log("data.repositories is ", data.repositories);

      setRepositories(data.repositories);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch repositories. Please try again later.",
      });
      console.log("error --fetchRepositories: ", error);
      console.log("Failed to fetch repositories at DashboardPage.tsx");
    } finally {
      setLoading(false);
    }
  }, [page, status, searchQuery]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Section */}
      <DashboardNavbar />

      {/* Main Content Area */}
      <div className="mt-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Manage your semantic code repositories
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => {}}
            >
              <Plus className="mr-2 h-4 w-4" />
              Import Repository
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border/40"
              />
            </div>
          </div>
        </div>
        {/* Repository Table */}
        <div className="mt-8 rounded-lg border border-border/40 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-accent/5">
                <TableHead className="font-semibold">Repository</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repositories.map((repo) => (
                <TableRow
                  key={repo.id}
                  className="hover:bg-accent/5 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-accent/30 flex items-center justify-center overflow-hidden relative mr-4">
                        {repo.avatarUrl ? (
                          <Image
                            src={repo.avatarUrl}
                            alt={`${repo.owner}'s avatar`}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          <Code className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      {repo.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        repo.status === "SUCCESS" ? "default" : "destructive"
                      }
                      className={
                        repo.status === "SUCCESS"
                          ? "bg-stats-green/20 text-stats-green hover:bg-stats-green/30"
                          : "bg-destructive/20 hover:bg-destructive/30"
                      }
                    >
                      {repo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(repo.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
