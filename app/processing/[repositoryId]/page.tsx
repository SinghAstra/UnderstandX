"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ActivityIcon,
  DatabaseIcon,
  PauseIcon,
  ServerIcon,
  TerminalIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

// Mock data structure for processing status
const initialProcessingStatus = {
  repositoryId: "repo-tech-dashboard-001",
  repositoryName: "AI-Powered-Research-Framework",
  startTime: new Date(),
  estimatedCompletionTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  jobs: [
    {
      name: "Repository Processing",
      status: "in-progress",
      progress: 65,
      resources: {
        cpu: 45,
        memory: 2.3, // GB
        diskIO: 120, // MB/s
      },
      logs: [
        "Cloning repository...",
        "Analyzing file structure...",
        "Preprocessing source files...",
      ],
    },
    {
      name: "Chunk Generation",
      status: "queued",
      progress: 0,
      resources: {
        cpu: 0,
        memory: 0,
        diskIO: 0,
      },
      logs: [],
    },
    {
      name: "Embedding Generation",
      status: "not-started",
      progress: 0,
      resources: {
        cpu: 0,
        memory: 0,
        diskIO: 0,
      },
      logs: [],
    },
  ],
};

const RepositoryProcessingDashboard = () => {
  const [processingStatus, setProcessingStatus] = useState(
    initialProcessingStatus
  );
  const [activeJob, setActiveJob] = useState(processingStatus.jobs[0]);

  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTimeRemaining = () => {
    const now = new Date();
    const remaining =
      processingStatus.estimatedCompletionTime.getTime() - now.getTime();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      {/* Navigation Menu */}
      <nav className="mb-6 flex space-x-4 justify-center">
        {[
          { href: "/", label: "Home" },
          { href: "/search", label: "Search" },
          { href: "/explore", label: "Explore" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/profile", label: "Profile" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Repository Processing: {processingStatus.repositoryName}
          </h1>
          <p className="text-muted-foreground">
            ID: {processingStatus.repositoryId}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <PauseIcon className="mr-2 h-4 w-4" /> Pause
          </Button>
          <Button variant="destructive">
            <XCircleIcon className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </div>
      </div>

      {/* Processing Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {processingStatus.jobs.map((job) => (
          <Card
            key={job.name}
            className={`cursor-pointer ${
              activeJob.name === job.name ? "border-primary" : ""
            }`}
            onClick={() => setActiveJob(job)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{job.name}</CardTitle>
              {job.status === "in-progress" && (
                <ActivityIcon className="text-primary" />
              )}
              {job.status === "queued" && (
                <ServerIcon className="text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{job.progress}%</div>
              <Progress value={job.progress} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Status: {job.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Job Information */}
      <div className="grid grid-cols-2 gap-4">
        {/* System Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ServerIcon className="mr-2" /> System Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>CPU Usage</span>
                <span>{activeJob.resources.cpu}%</span>
              </div>
              <div className="flex justify-between">
                <span>Memory</span>
                <span>{activeJob.resources.memory} GB</span>
              </div>
              <div className="flex justify-between">
                <span>Disk I/O</span>
                <span>{activeJob.resources.diskIO} MB/s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TerminalIcon className="mr-2" /> Diagnostic Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 overflow-auto border rounded p-2">
              {activeJob.logs.length ? (
                activeJob.logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-xs text-muted-foreground border-b last:border-b-0 py-1"
                  >
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No logs available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Timeline */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DatabaseIcon className="mr-2" /> Processing Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <strong>Started</strong>
              <p>{formatTime(processingStatus.startTime)}</p>
            </div>
            <div>
              <strong>Estimated Completion</strong>
              <p>{formatTime(processingStatus.estimatedCompletionTime)}</p>
            </div>
            <div>
              <strong>Time Remaining</strong>
              <p>{calculateTimeRemaining()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepositoryProcessingDashboard;
