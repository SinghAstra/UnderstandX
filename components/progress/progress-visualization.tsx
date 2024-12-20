import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { CircularProgress } from "./circular-progress";
import { EstimatedTime } from "./estimated-time";
import { TimelineStep } from "./timeline-step";

interface Step {
  id: string;
  title: string;
  completedAt?: string;
}

interface ProgressVisualizationProps {
  steps: Step[];
  currentStep: number;
  repoSize: number;
  startTime: Date;
}

export function ProgressVisualization({
  steps,
  currentStep,
  repoSize,
  startTime,
}: ProgressVisualizationProps) {
  const [currentJob, setCurrentJob] = useState("REPOSITORY_PROCESSING"); // Example backend status

  const jobs = {
    REPOSITORY_PROCESSING: 0,
    CHUNK_GENERATION: 1,
    EMBEDDING_GENERATION: 2,
    COMPLETED: 3,
  };

  const getCurrentStep = (jobStatus) => {
    return jobs[jobStatus] || 0;
  };

  const getStepStatus = (stepJobStatus) => {
    const currentStepNumber = getCurrentStep(currentJob);
    const stepNumber = jobs[stepJobStatus];

    if (currentJob === "COMPLETED") return "complete";
    if (stepNumber === currentStepNumber) return "processing";
    if (stepNumber < currentStepNumber) return "complete";
    return "pending";
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Card>
      <CardContent className="grid grid-cols-[1fr_2fr] gap-8 p-6">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress progress={progress} />
          <EstimatedTime
            repoSize={repoSize}
            startTime={startTime}
            completedSteps={currentStep}
            totalSteps={steps.length}
          />
        </div>

        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-4">
              {getStepStatus(step.jobStatus) === "complete" && (
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              )}
              {getStepStatus(step.jobStatus) === "processing" && (
                <Loader2Icon className="h-5 w-5 text-blue-500 animate-spin mt-0.5" />
              )}
              {getStepStatus(step.jobStatus) === "pending" && (
                <div className="h-5 w-5 rounded-full border-2 mt-0.5" />
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{step.title}</h3>
                  {getStepStatus(step.jobStatus) === "processing" && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
