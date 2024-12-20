import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import {
  JOB_STEP_MAP,
  JobStatus,
  PROCESSING_STEPS,
  StepStatus,
} from "@/types/repository";
import { CheckCircle2, Loader2Icon } from "lucide-react";
import React from "react";
import { CircularProgress } from "./circular-progress";
import { EstimatedTime } from "./estimated-time";

interface ProgressVisualizationProps {
  repoSize: number;
  startTime: Date;
  currentJob: JobStatus;
  error?: string;
}

interface StepIndicatorProps {
  status: StepStatus;
}

const StepIndicator = ({ status }: StepIndicatorProps) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />;
    case "PROCESSING":
      return (
        <Loader2Icon className="h-5 w-5 text-blue-500 animate-spin mt-0.5" />
      );
    case "ERROR":
      return (
        <div className="h-5 w-5 rounded-full border-2 border-red-500 mt-0.5" />
      );
    default:
      return (
        <div className="h-5 w-5 rounded-full border-2 border-gray-700 mt-0.5" />
      );
  }
};

interface StepBadgeProps {
  status: StepStatus;
}

const StepBadge = ({ status }: StepBadgeProps) => {
  const variants = {
    PROCESSING: "text-blue-700 border border-blue-500",
    COMPLETED: "text-green-700 border border-green-700",
    ERROR: "text-red-700 border border-red-700",
    PENDING: "",
  };

  const labels = {
    PROCESSING: "In Progress",
    COMPLETED: "Completed",
    ERROR: "Failed",
    PENDING: "",
  };

  if (status === "PENDING") return null;

  return (
    <span className={cn("text-xs px-2 py-1 rounded-full", variants[status])}>
      {labels[status]}
    </span>
  );
};

export function ProgressVisualization({
  repoSize,
  startTime,
  currentJob,
  error,
}: ProgressVisualizationProps) {
  const steps = PROCESSING_STEPS;
  const currentStep = JOB_STEP_MAP[currentJob];

  const getStepStatus = (stepJobStatus: JobStatus): StepStatus => {
    if (error) return "ERROR";
    if (currentJob === "COMPLETED") return currentJob;

    const currentStepNumber = JOB_STEP_MAP[currentJob];
    const stepNumber = JOB_STEP_MAP[stepJobStatus];

    if (stepNumber === currentStepNumber) return "PROCESSING";
    if (stepNumber < currentStepNumber) return "COMPLETED";
    return "PENDING";
  };

  const progress = (currentStep / steps.length) * 100;
  const isError = currentJob === "ERROR";

  return (
    <Card>
      <CardContent className="flex gap-6 p-4">
        <div className="flex flex-col items-center justify-center gap-4 flex-1">
          <CircularProgress progress={progress} error={isError} />
          <EstimatedTime
            repoSize={repoSize}
            startTime={startTime}
            completedSteps={currentStep}
            totalSteps={steps.length}
            error={isError}
          />
        </div>

        <div className="space-y-2 flex-[2]">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg transition-colors",
                getStepStatus(step.jobStatus) === "PROCESSING" &&
                  "bg-background backdrop-blur-lg",
                getStepStatus(step.jobStatus) === "ERROR" && "bg-red-50/50"
              )}
            >
              <StepIndicator status={getStepStatus(step.jobStatus)} />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{step.title}</h3>
                  <StepBadge status={getStepStatus(step.jobStatus)} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {step.error && getStepStatus(step.jobStatus) === "ERROR" && (
                  <p className="text-sm text-red-600 mt-2">
                    Error: {step.error}
                  </p>
                )}
                {step.completedAt &&
                  getStepStatus(step.jobStatus) === "COMPLETED" && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Completed at{" "}
                      {new Date(step.completedAt).toLocaleTimeString()}
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
