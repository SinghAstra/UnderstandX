import { Clock } from "lucide-react";
import React from "react";

interface EstimatedTimeProps {
  repoSize: number; // in KB
  startTime: Date;
  completedSteps: number;
  totalSteps: number;
}

export function EstimatedTime({
  repoSize,
  startTime,
  completedSteps,
  totalSteps,
}: EstimatedTimeProps) {
  const calculateEstimatedTime = () => {
    const avgTimePerKB = 0.05; // 50ms per KB as baseline
    const totalEstimatedSeconds = (repoSize * avgTimePerKB) / 1000;
    const elapsedTime = (new Date().getTime() - startTime.getTime()) / 1000;
    const remainingTime =
      totalEstimatedSeconds * (1 - completedSteps / totalSteps);

    return Math.max(0, Math.ceil(remainingTime));
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>
        Estimated time remaining: {formatTime(calculateEstimatedTime())}
      </span>
    </div>
  );
}
