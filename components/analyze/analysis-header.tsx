import { FadeIn } from "@/components/animations/fade-in";
import { TextGenerateEffect } from "@/components/animations/text-generate-effect";
import React from "react";

interface AnalysisHeaderProps {
  isAnalyzing: boolean;
  error: string | undefined;
  // results: AnalysisResult | undefined;
}

const AnalysisHeader = ({
  isAnalyzing,
  error,
}: // results,
AnalysisHeaderProps) => {
  const getMessage = () => {
    if (error) {
      return "Please check the repository URL and try again";
    }

    // if (results) {
    //   return "Analysis completed! Review the results below";
    // }

    if (isAnalyzing) {
      return "Analyzing repository structure and dependencies...";
    }

    return "Enter your GitHub repository URL to begin analysis";
  };

  return (
    <div className="text-center">
      <FadeIn>
        <TextGenerateEffect words={getMessage()} className="text-2xl" />
      </FadeIn>
    </div>
  );
};

export default AnalysisHeader;
