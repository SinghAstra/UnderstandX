"use client";

import { useEffect, useState } from "react";
import AnimationContainer from "../global/animation-container";

export type LogEntry = {
  timestamp: Date;
  message: string;
  status?: string;
};

const BackgroundTerminal = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const initialLogs: LogEntry[] = [
      {
        timestamp: new Date(),
        message: "$ Initializing repository analyzer...",
      },
      {
        timestamp: new Date(),
        message: "$ Fetching repository structure...",
      },
      {
        timestamp: new Date(),
        message: "$ Processing file structure...",
      },
      {
        timestamp: new Date(),
        message: "$ Analyzing code dependencies...",
      },
      {
        timestamp: new Date(),
        message: "$ Scanning for common patterns...",
      },
    ];
    initialLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs((prevLogs) => [
          ...prevLogs,
          {
            ...log,
            timestamp: new Date(),
          },
        ]);
      }, index * 700);
    });
  }, []);

  return (
    <div className="absolute inset-x-8 top-4 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)] group-hover:scale-105">
      <div
        className={`w-full bg-background/40 backdrop-blur rounded-lg border`}
      >
        <div className="relative">
          <div className="rounded-md p-4  font-mono text-xs space-y-2 relative text-muted-foreground">
            {logs.map((log, index) => (
              <AnimationContainer key={index}>
                <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-1">
                  <span className="text-muted-foreground opacity-70">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="whitespace-pre-wrap">{log.message}</span>
                </div>
              </AnimationContainer>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundTerminal;
