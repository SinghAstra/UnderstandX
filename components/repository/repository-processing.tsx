import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProcessingStatus } from "@/hooks/use-processing-status";
import { ProcessingUpdate } from "@/interfaces/processing";
import { Repository } from "@prisma/client";
import { Terminal } from "lucide-react";
import React, { useEffect, useState } from "react";

const RepositoryProcessing = ({ repository }: { repository: Repository }) => {
  const [logs, setLogs] = useState<ProcessingUpdate[]>([]);
  const currentStatus = useProcessingStatus(repository.id);

  useEffect(() => {
    if (currentStatus) {
      setLogs((prev) => [currentStatus, ...prev]);
    }
  }, [currentStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-500";
      case "FAILED":
        return "bg-red-500";
      case "PROCESSING":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString();
  };

  return (
    <Card className="w-full border">
      <CardHeader className="border-b border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-gray-400" />
            <CardTitle className="text-gray-100">
              Repository Processing
            </CardTitle>
          </div>
          {repository.status !== "SUCCESS" &&
            repository.status !== "FAILED" && (
              <Badge
                variant="outline"
                className="animate-pulse bg-blue-500/10 text-blue-500"
              >
                Processing
              </Badge>
            )}
        </div>
        <CardDescription className="text-gray-400">
          Processing repository: {repository.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-2 font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-gray-500">[{formatTimestamp()}]</span>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(log.status)} text-white`}
                >
                  {log.status}
                </Badge>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500 italic">
                Waiting for processing to start...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RepositoryProcessing;
