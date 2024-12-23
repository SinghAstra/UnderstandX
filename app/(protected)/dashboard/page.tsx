"use client";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import TableSkeleton from "@/components/skeleton/table-skeleton";
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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  // const [status, setStatus] = useState("");
  // const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const page = 1;
  const router = useRouter();

  if (repositories.length > 0) {
    console.log("repositories[0].status is ", repositories[0].status);
  }

  const fetchRepositories = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
        // ...(status && { status }),
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
  }, [searchQuery]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Section */}
      <DashboardNavbar />

      {/* Main Content Area */}
      <div className="mt-8 container mx-auto">
        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border/40"
            />
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => {
              router.push("/search");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Repository
          </Button>
        </div>
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="mt-8 rounded-lg border border-border/40 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-accent/5">
                  <TableHead className="font-semibold text-center">
                    Repository
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Last Updated
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repositories.map((repo) => (
                  <TableRow
                    key={repo.id}
                    className="hover:bg-accent/5 transition-colors"
                  >
                    <TableCell className="text-center flex items-center justify-center">
                      <div className="h-8 w-8 rounded-md bg-accent/30 flex items-center justify-center overflow-hidden relative mr-4">
                        {repo.avatarUrl ? (
                          <Image
                            src={repo.avatarUrl}
                            alt={`${repo.owner}'s avatar`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Code className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      {repo.owner}
                      {" / "}
                      {repo.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          repo.status === "SUCCESS" ? "outline" : "destructive"
                        }
                      >
                        {repo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {new Date(repo.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
