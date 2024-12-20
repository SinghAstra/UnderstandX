import React from "react";

interface EstimatedTimeProps {
  repoSize: number;
  startTime: Date;
  completedSteps: number;
  totalSteps: number;
  error?: boolean;
}

export const EstimatedTime: React.FC<EstimatedTimeProps> = ({
  repoSize,
  startTime,
  completedSteps,
  totalSteps,
  error,
}) => {
  const calculateEstimatedTime = () => {
    // Base time per step in milliseconds (30 seconds per step)
    const baseTimePerStep = 30000;
    // Additional time based on repo size (1 second per MB)
    const sizeBasedTime = repoSize * 1000;

    const totalEstimatedTime = baseTimePerStep * totalSteps + sizeBasedTime;
    const timeElapsed = Date.now() - startTime.getTime();
    const remainingTime = totalEstimatedTime - timeElapsed;

    return Math.max(0, remainingTime);
  };

  const formatTime = (ms: number): string => {
    if (ms === 0) return "Almost done...";

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    if (minutes > 0) {
      return `~${minutes}m ${seconds}s remaining`;
    }
    return `~${seconds}s remaining`;
  };

  if (error) {
    return (
      <div className="text-center">
        <p className="text-sm font-medium text-red-500">Processing failed</p>
        <p className="text-xs text-muted-foreground mt-1">Please try again</p>
      </div>
    );
  }

  if (completedSteps === totalSteps) {
    return (
      <div className="text-center">
        <p className="text-sm font-medium text-green-500">
          Processing complete
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Finished in {formatTime(Date.now() - startTime.getTime())}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-blue-500">
        {formatTime(calculateEstimatedTime())}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Processing {repoSize}MB repository
      </p>
    </div>
  );
};
