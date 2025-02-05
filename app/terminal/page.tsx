"use client";

import Terminal from "@/components/ui-components/terminal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";

const TerminalPage = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate real-time log updates
  const addRandomLine = () => {
    const logMessages = [
      "Starting server on port 3000...",
      "Connected to database successfully",
      "New user registered: user123",
      "Processing image upload...",
      "Cache invalidated",
      "API request received: GET /api/users",
      "Background job completed",
      "Memory usage: 256MB",
      "New deployment initiated",
      "Security scan completed",
    ];

    const randomLine =
      logMessages[Math.floor(Math.random() * logMessages.length)];
    setLines((prev) => [...prev, randomLine]);
  };

  // Start/stop automatic updates
  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  // Clear all lines
  const clearLines = () => {
    setLines([]);
  };

  // Add custom line
  const addCustomLine = () => {
    const timestamp = new Date().toLocaleTimeString();
    setLines((prev) => [...prev, `Custom log entry at ${timestamp}`]);
  };

  // Effect for automatic updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isSimulating) {
      intervalId = setInterval(() => {
        addRandomLine();
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSimulating]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Terminal Demo</CardTitle>
          <CardDescription>
            A demonstration of the Terminal component with real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={toggleSimulation}
              variant={isSimulating ? "destructive" : "default"}
            >
              {isSimulating ? "Stop Updates" : "Start Updates"}
            </Button>
            <Button onClick={addCustomLine} variant="outline">
              Add Custom Line
            </Button>
            <Button onClick={clearLines} variant="secondary">
              Clear Terminal
            </Button>
          </div>

          <Terminal
            lines={lines}
            welcomeMessage="Welcome to Terminal Demo"
            prompt="$"
            height={400}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TerminalPage;
