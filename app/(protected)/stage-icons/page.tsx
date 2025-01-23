import { cn } from "@/lib/utils/utils";
import { LucideIcon, Rocket, Shield, User, UserCircle } from "lucide-react";
import React from "react";

// Stage type definition
type Stage = {
  id: string;
  icon: LucideIcon;
  title?: string;
  status: "completed" | "current" | "pending";
};

// Sample static stages array
const initialStages: Stage[] = [
  {
    id: "signup",
    icon: User,
    status: "completed",
  },
  {
    id: "profile",
    icon: UserCircle,
    status: "current",
  },
  {
    id: "verification",
    icon: Shield,
    status: "pending",
  },
  {
    id: "onboarding",
    icon: Rocket,
    status: "pending",
  },
];

type MultiStageProcessProps = {
  stages?: Stage[];
  direction?: "horizontal" | "vertical";
};

const MultiStageProcess = ({
  stages = initialStages,
  direction = "vertical",
}: MultiStageProcessProps) => {
  const isHorizontal = direction === "horizontal";
  return (
    <div
      className={cn(
        "flex p-4 bg-background rounded-lg border border-border shadow-md",
        isHorizontal
          ? "flex-row items-center justify-between"
          : "flex-col items-start w-min"
      )}
    >
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div
            className={cn(
              "flex items-center",
              isHorizontal ? "flex-col" : "flex-row space-x-4 items-center"
            )}
          >
            <div
              className={cn(
                "rounded-full flex items-center justify-center mb-2",
                "w-16 h-16",
                {
                  "bg-green-100/20 text-green-600":
                    stage.status === "completed",
                  "bg-primary/20 text-primary": stage.status === "current",
                  "bg-muted/20 text-muted-foreground":
                    stage.status === "pending",
                }
              )}
            >
              <stage.icon className="w-8 h-8" />
            </div>
            <p
              className={cn("text-sm font-medium", {
                "text-green-600": stage.status === "completed",
                "text-blue-600": stage.status === "current",
                "text-gray-400": stage.status === "pending",
              })}
            >
              {stage.title}
            </p>
          </div>
          {index < stages.length - 1 && (
            <div
              className={cn(
                "flex-grow mx-2",
                isHorizontal ? "" : "w-px h-8 my-2 self-center"
              )}
            >
              <div
                className={cn(isHorizontal ? "h-1 w-full" : "w-px h-full", {
                  "bg-green-300":
                    stages[index].status === "completed" &&
                    stages[index + 1].status !== "pending",
                  "bg-muted": stages[index + 1].status === "pending",
                })}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MultiStageProcess;
