"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, GitBranch, Package, Terminal } from "lucide-react";
import React, { useState } from "react";

const ProcessingStages = () => {
  const [activeStage, setActiveStage] = useState(1);

  const stages = [
    {
      id: 1,
      name: "Clone Repository",
      status: "completed",
      icon: GitBranch,
      logs: [
        "$ git clone https://github.com/user/repo.git",
        "Cloning into 'repo'...",
        "remote: Counting objects: 100% (123/123)",
        "remote: Compressing objects: 100% (100/100)",
        "Successfully cloned repository",
      ],
    },
    {
      id: 2,
      name: "Install Dependencies",
      status: "in-progress",
      icon: Package,
      logs: [
        "$ npm install",
        "added 1250 packages in 45s",
        "Installing dev dependencies...",
        "[███████████████████  ] 87% ",
      ],
    },
    {
      id: 3,
      name: "Build Project",
      status: "pending",
      icon: Cpu,
      logs: [],
    },
  ];

  return (
    <div className="min-h-screen text-gray-100 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 w-full border-b border-border/80 mb-6 backdrop-blur-sm bg-background/50 supports-[backdrop-filter]:bg-background/50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium flex items-center gap-2">
            <span className="text-primary">AppName</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground/80">user</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground/80">repo</span>
          </h1>
          <div className="flex items-center space-x-2 bg-secondary/50 px-3 py-1 rounded-full">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-foreground/80">Processing</span>
          </div>
        </div>
        <Skeleton className="h-10 w-10 rounded-full border-primary/20 border-2" />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto w-full p-4">
        <div className="flex gap-8">
          {/* Stage Timeline */}
          <div className="relative flex flex-col items-center">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${
                      stage.status === "completed"
                        ? "bg-primary/20 text-primary ring-2 ring-primary/20"
                        : stage.status === "in-progress"
                        ? "bg-secondary text-primary ring-2 ring-primary/20"
                        : "bg-secondary/50 text-muted-foreground"
                    }`}
                >
                  {React.createElement(stage.icon, { size: 20 })}
                </div>
                {index !== stages.length - 1 && (
                  <div
                    className={`w-0.5 h-24 transition-all duration-300 ${
                      stage.status === "completed"
                        ? "bg-primary/20"
                        : "bg-secondary/50"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Terminal Card */}
          <Card className="flex-1 bg-card border-border/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="border-b border-border/80 p-3 flex items-center space-x-4">
                <div className="flex space-x-2">
                  {stages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStage(stage.id)}
                      className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200
                        ${
                          activeStage === stage.id
                            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                    >
                      {stage.name}
                    </button>
                  ))}
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="p-6 font-mono text-sm space-y-2 tracking-widest">
                  {stages
                    .find((s) => s.id === activeStage)
                    ?.logs.map((log, idx) => (
                      <div
                        key={idx}
                      >
                        <span className="text-primary">></span>
                        <span className="ml-3 text-foreground/80">{log}</span>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStages;
