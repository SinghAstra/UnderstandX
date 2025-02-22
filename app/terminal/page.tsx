"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";

type LogEntry = {
  id: string;
  timestamp: Date;
  message: string;
};

function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const generateRandomLog = () => {
    const messages = [
      "Initializing...",
      "Fetching data...",
      "Compiling...",
      "Running tests...",
      "Deploying...",
      "Process completed!",
    ];

    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      message: messages[Math.floor(Math.random() * messages.length)],
    };

    setLogs((prev) => [...prev, newLog]);
  };

  const startLogging = () => {
    setLogs([]); // Clear previous logs
    const interval = setInterval(generateRandomLog, 1500); // Add log every 1.5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  };

  useEffect(() => {
    const stopLogging = startLogging();
    return stopLogging; // Stop logging when component unmounts
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg border border-border">
          <ScrollArea className="h-[400px] rounded-md p-4" ref={scrollRef}>
            <div className="font-mono text-sm space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-1"
                >
                  <span className="text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="text-foreground whitespace-pre-wrap">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default App;
