import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import React from "react";

interface TimelineStepProps {
  title: string;
  timestamp?: string;
  status: "completed" | "current" | "pending";
  isLast?: boolean;
}

export function TimelineStep({
  title,
  timestamp,
  status,
  isLast,
}: TimelineStepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center">
          {status === "completed" && (
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          )}
          {status === "current" && (
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          )}
          {status === "pending" && (
            <Clock className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        {!isLast && <div className="w-px h-full bg-border" />}
      </div>
      <div className="pb-8">
        <p className="font-medium">{title}</p>
        {timestamp && (
          <time className="text-sm text-muted-foreground">{timestamp}</time>
        )}
      </div>
    </div>
  );
}
