"use client";

import { Button } from "@/components/ui/button";
import { RepoCard } from "@/components/ui/repo-card";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

export interface AnalysisResult {
  repository: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
  };
  technicalDetails: {
    languages: Array<{ name: string; percentage: number }>;
    frameworks: string[];
    dependencies: string[];
  };
  generatedPrompt: string;
}

interface AnalysisResultsProps {
  results: AnalysisResult;
  onContinue: () => void;
}

export function AnalysisResults({ results, onContinue }: AnalysisResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <RepoCard
        name={results.repository.name}
        description={results.repository.description}
        language={results.repository.language}
        stars={results.repository.stars}
        forks={results.repository.forks}
        className="w-full"
      />

      <div className="space-y-4 rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Technical Analysis</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Languages
            </h4>
            <ul className="mt-2 space-y-2">
              {results.technicalDetails.languages.map((lang) => (
                <li
                  key={lang.name}
                  className="flex items-center justify-between"
                >
                  <span>{lang.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {lang.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Frameworks & Dependencies
            </h4>
            <ul className="mt-2 space-y-1">
              {results.technicalDetails.frameworks.map((framework) => (
                <li key={framework}>{framework}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button onClick={onContinue}>
          Continue to Refinement
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
