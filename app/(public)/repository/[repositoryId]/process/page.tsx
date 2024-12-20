"use client";

import RepositoryHeaderBreadCrumb from "@/components/progress/breadcrumb";
import { ProgressVisualization } from "@/components/progress/progress-visualization";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProcessingStatus } from "@/types/jobs";
import { AlertCircle, CheckCircle2, Github, RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProcessingStatusPage = () => {
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const repositoryId = params.repositoryId as string;
  //   const [error, setError] = useState(null);

  const mockStatus: ProcessingStatus = {
    currentJob: "CHUNK_GENERATION",
    startTime: new Date().toISOString(),
    repoSize: 1024,
    repository: {
      id: repositoryId,
      githubId: 123456789,
      name: "next-semantic-search",
      fullName: "acme/next-semantic-search",
      description: "A powerful semantic search engine built with Next.js",
      status: "PENDING",
      owner: "acme",
      url: "https://github.com/acme/next-semantic-search",
      startedAt: new Date().toISOString(),
      avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
    },
  };

  useEffect(() => {
    // Replace with actual API call
    setStatus(mockStatus);
    setLoading(false);
  }, []);

  const refreshStatus = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      //   const updatedStatus = await fetch(`/api/repository/${repositoryId}/status`);
      // setStatus(await updatedStatus.json());
    } catch (error) {
      console.log("Failed to refresh status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!status) return null;

  const { repository } = status;

  return (
    <div className="min-h-screen bg-background">
      <RepositoryHeaderBreadCrumb
        owner={repository.owner}
        name={repository.name}
      />
      <div className="container mx-auto">
        <div className="w-full px-4">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={repository.avatarUrl}
                        alt={`${repository.owner}'s avatar`}
                      />
                    </Avatar>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl tracking-tight">
                          {repository.fullName}
                        </h1>
                        <Badge variant="default">{repository.status}</Badge>
                      </div>

                      <p className="text-muted-foreground">
                        {repository.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshStatus}
                    disabled={loading}
                    className="gap-2"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh Status
                  </Button>
                  <a
                    href={repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </a>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ProgressVisualization
                currentJob={status.currentJob}
                repoSize={status.repoSize}
                startTime={new Date()}
              />

              {status.error && (
                <Alert className="mt-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{status.error}</AlertDescription>
                </Alert>
              )}

              {status.currentJob !== "COMPLETED" && (
                <Alert className="mt-6">
                  <AlertTitle>Processing in Progress</AlertTitle>
                  <AlertDescription>
                    You can safely navigate away - we&apos;ll continue
                    processing in the background. Check back anytime to view
                    progress.
                  </AlertDescription>
                </Alert>
              )}

              {status.currentJob === "COMPLETED" && (
                <Alert className="mt-6 text-green-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Processing Complete!</AlertTitle>
                  <AlertDescription>
                    Repository has been processed successfully. Redirecting you
                    to the repository page...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatusPage;
