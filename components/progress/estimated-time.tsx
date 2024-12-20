import React, { useEffect, useMemo, useState } from "react";

// Constants for time calculations
const TIME_CONSTANTS = {
  BASE_TIME_PER_STEP_MS: 30000, // 30 seconds
  SIZE_FACTOR_MS: 1000, // 1 second per MB
  UPDATE_INTERVAL_MS: 1000, // Update every second
} as const;

interface EstimatedTimeProps {
  repoSize: number;
  startTime: Date;
  completedSteps: number;
  totalSteps: number;
  error?: boolean;
  onComplete?: () => void;
}

interface TimeDisplay {
  minutes: number;
  seconds: number;
  formatted: string;
}

export const EstimatedTime = ({
  repoSize,
  startTime,
  completedSteps,
  totalSteps,
  error = false,
  onComplete,
}: EstimatedTimeProps) => {
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Memoize the estimated time calculation
  const estimatedTime = useMemo(() => {
    const calculateTimeRemaining = (): number => {
      const baseTime = TIME_CONSTANTS.BASE_TIME_PER_STEP_MS * totalSteps;
      const sizeBasedTime = repoSize * TIME_CONSTANTS.SIZE_FACTOR_MS;
      const totalEstimatedTime = baseTime + sizeBasedTime;
      const timeElapsed = currentTime - startTime.getTime();

      // Adjust remaining time based on completed steps
      const stepProgress = completedSteps / totalSteps;
      const adjustedRemaining =
        totalEstimatedTime * (1 - stepProgress) - timeElapsed;

      return Math.max(0, adjustedRemaining);
    };

    const formatTimeDisplay = (ms: number): TimeDisplay => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const formatted =
        minutes > 0
          ? `${minutes}m ${seconds}s remaining`
          : seconds > 0
          ? `${seconds}s remaining`
          : "Almost done...";

      return { minutes, seconds, formatted };
    };

    return formatTimeDisplay(calculateTimeRemaining());
  }, [currentTime, startTime, repoSize, completedSteps, totalSteps]);

  // Set up timer for real-time updates
  useEffect(() => {
    if (error || completedSteps === totalSteps) return;

    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, TIME_CONSTANTS.UPDATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [error, completedSteps, totalSteps]);

  // Trigger onComplete callback when processing is done
  useEffect(() => {
    if (completedSteps === totalSteps && onComplete) {
      onComplete();
    }
  }, [completedSteps, totalSteps, onComplete]);

  const getElapsedTimeDisplay = (): string => {
    const elapsed = currentTime - startTime.getTime();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  if (error) {
    return (
      <div className="text-center">
        <p className="text-sm font-medium text-red-500">Processing failed</p>
        <p className="text-xs text-muted-foreground mt-1">
          Stopped after {getElapsedTimeDisplay()}
        </p>
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
          Finished in {getElapsedTimeDisplay()}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-blue-500">
        {estimatedTime.formatted}
      </p>
    </div>
  );
};
