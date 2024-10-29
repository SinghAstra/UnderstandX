"use client";

import AnalysisHeader from "@/components/analyze/analysis-header";
import {
  AnalysisResult,
  AnalysisResults,
} from "@/components/analyze/analysis-results";
import { AnalysisSteps, Step } from "@/components/analyze/analysis-steps";
import { URLInput } from "@/components/analyze/url-input";
import { FadeIn } from "@/components/animations/fade-in";
import { GitHubService } from "@/services/githubService";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialSteps: Step[] = [
  { id: 1, label: "Fetching repository data", status: "pending" },
  { id: 2, label: "Analyzing codebase structure", status: "pending" },
  { id: 3, label: "Generating comprehensive prompt", status: "pending" },
];

export default function AnalyzePage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>();
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<AnalysisResult>();

  const updateStep = (stepId: number, status: Step["status"]) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const handleAnalysis = async (url: string) => {
    setIsAnalyzing(true);
    setError(undefined);
    const githubService = new GitHubService(
      process.env.NEXT_PUBLIC_GITHUB_TOKEN
    );

    try {
      // Step 1: Fetch repository data
      setCurrentStep(0);
      updateStep(1, "in-progress");

      const analysisResult = await githubService.analyzeRepository(url);
      updateStep(1, "complete");

      // Step 2: Analyze codebase
      setCurrentStep(1);
      updateStep(2, "in-progress");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate analysis time
      updateStep(2, "complete");

      // Step 3: Generate prompt
      setCurrentStep(2);
      updateStep(3, "in-progress");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate generation time
      updateStep(3, "complete");

      setResults(analysisResult);
    } catch (err) {
      console.error("Error analyzing repository:", err);
      let errorMessage = "Failed to analyze repository. Please try again.";

      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes("404")) {
          errorMessage =
            "Repository not found. Please check the URL and ensure you have access.";
        } else if (err.message.includes("401")) {
          errorMessage =
            "Unable to access private repository. Please check your authentication token.";
        } else if (err.message.includes("403")) {
          errorMessage =
            "Access forbidden. Please verify your permissions for this repository.";
        }
      }

      setError(errorMessage);
      steps.forEach((step) => {
        if (step.status === "in-progress") {
          updateStep(step.id, "error");
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    router.push("/refine");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8">
        <AnalysisHeader
          isAnalyzing={isAnalyzing}
          error={error}
          results={results}
        />

        <URLInput
          onAnalyze={handleAnalysis}
          isAnalyzing={isAnalyzing}
          error={error}
        />

        {isAnalyzing && (
          <FadeIn>
            <div className="flex flex-col space-y-6">
              <AnalysisSteps steps={steps} currentStep={currentStep} />
            </div>
          </FadeIn>
        )}

        {results && !isAnalyzing && (
          <FadeIn>
            <div className="space-y-6">
              <AnalysisResults results={results} onContinue={handleContinue} />
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
