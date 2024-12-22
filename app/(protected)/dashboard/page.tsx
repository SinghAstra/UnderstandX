"use client";
import { DatePickerWithRange } from "@/components/custom-ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repository } from "@prisma/client";
import { Code, Eye, Loader2, Plus, Share2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    success: 0,
  });

  useEffect(() => {
    fetchRepositories();
  }, [page, status, searchQuery, dateRange]);

  const fetchRepositories = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(status && { status }),
      });
      const response = await fetch(`/api/repository?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch repositories.");
      }
      const data = await response.json();

      setRepositories(data.repositories);
      setStats({
        total: data.pagination.totalCount,
        pending: data.repositories.filter(
          (r: Repository) => r.status === "PENDING"
        ).length,
        success: data.repositories.filter(
          (r: Repository) => r.status === "SUCCESS"
        ).length,
      });
    } catch (error) {
      // TODO : ADD a toast here
      // Use console.log and not console.error
      // Specify file and line number in the console.log
      // Do not print error just tell that error has occured at this line
      console.log("Failed to fetch repositories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Top Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Manage your semantic code repositories
            </p>
          </div>
          <Button className="bg-primary" onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" />
            Import Repository
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                {stats.total}
              </CardTitle>
              <CardDescription>Total Repositories</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                {stats.pending}
              </CardTitle>
              <CardDescription>Processing</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                {stats.success}
              </CardTitle>
              <CardDescription>Ready</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-8 flex gap-6">
        {/* Repository Table */}
        <div className="flex-grow">
          <Card>
            <CardHeader>
              <CardTitle>Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repositories.map((repo) => (
                    <TableRow key={repo.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4" />
                          <span>{repo.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            repo.status === "SUCCESS"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {repo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Progress
                          value={repo.status === "SUCCESS" ? 100 : 70}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(repo.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="PENDING">Processing</SelectItem>
                    <SelectItem value="SUCCESS">Ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DatePickerWithRange />
              </div>
            </CardContent>
          </Card>

          {/* Processing Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repositories
                  .filter((repo) => repo.status === "PENDING")
                  .map((repo) => (
                    <div key={repo.id} className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{repo.name}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
