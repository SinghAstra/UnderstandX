"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

export interface Step {
  id: number;
  label: string;
  status: "pending" | "in-progress" | "complete" | "error";
}

interface AnalysisStepsProps {
  steps: Step[];
  currentStep: number;
}

export function AnalysisSteps({ steps }: AnalysisStepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className={cn(
            "flex items-center gap-4 rounded-lg border p-4",
            step.status === "complete" && "border-green-500/20 bg-green-500/10",
            step.status === "in-progress" &&
              "border-blue-500/20 bg-blue-500/10",
            step.status === "error" && "border-red-500/20 bg-red-500/10"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            {step.status === "complete" ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : step.status === "in-progress" ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{step.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
