"use client";

import {
  AnalysisResult,
  AnalysisResults,
} from "@/components/analyze/analysis-results";
import { AnalysisSteps, Step } from "@/components/analyze/analysis-steps";
import { URLInput } from "@/components/analyze/url-input";
import { FadeIn } from "@/components/animations/fade-in";
import { TextGenerateEffect } from "@/components/animations/text-generate-effect";
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
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<AnalysisResult>();

  const updateStep = (stepId: number, status: Step["status"]) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const simulateAnalysis = async (url: string) => {
    setIsAnalyzing(true);
    setError(undefined);

    try {
      // Simulate API calls with delays
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        updateStep(i + 1, "in-progress");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateStep(i + 1, "complete");
      }

      // Simulate results
      setResults({
        repository: {
          name: "next.js",
          description: "The React Framework for the Web",
          language: "TypeScript",
          stars: 12500,
          forks: 3200,
        },
        technicalDetails: {
          languages: [
            { name: "TypeScript", percentage: 65 },
            { name: "JavaScript", percentage: 25 },
            { name: "CSS", percentage: 10 },
          ],
          frameworks: ["React", "Next.js", "Tailwind CSS"],
          dependencies: ["react", "next", "tailwindcss"],
        },
        generatedPrompt: "Analysis complete",
      });
    } catch (err) {
      setError("Failed to analyze repository. Please try again.");
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
    <main className="container max-w-4xl py-24">
      <FadeIn>
        <h1 className="text-center text-4xl font-bold tracking-tight">
          <TextGenerateEffect words="Analyze Your Repository" />
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          Enter your GitHub repository URL to begin the analysis
        </p>
      </FadeIn>

      <div className="mt-12 space-y-8">
        <URLInput
          onAnalyze={simulateAnalysis}
          isAnalyzing={isAnalyzing}
          error={error}
        />

        {isAnalyzing && (
          <FadeIn>
            <AnalysisSteps steps={steps} currentStep={currentStep} />
          </FadeIn>
        )}

        {results && !isAnalyzing && (
          <AnalysisResults results={results} onContinue={handleContinue} />
        )}
      </div>
    </main>
  );
}
