export interface Step {
  id: number;
  label: string;
  status: "pending" | "in-progress" | "complete" | "error";
}

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
