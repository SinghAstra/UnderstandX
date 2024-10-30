"use client";

export default function NewChat() {
  // const [isAnalyzing, setIsAnalyzing] = useState(false);
  // const [error, setError] = useState<string>();

  // const handleAnalysis = async (url: string) => {
  //   setIsAnalyzing(true);
  //   setError(undefined);

  //   try {
  //   } catch (err) {
  //     console.error("Error analyzing repository:", err);
  //     let errorMessage = "Failed to analyze repository. Please try again.";

  //     if (err instanceof Error) {
  //       // Handle specific error cases
  //       if (err.message.includes("404")) {
  //         errorMessage =
  //           "Repository not found. Please check the URL and ensure you have access.";
  //       } else if (err.message.includes("401")) {
  //         errorMessage =
  //           "Unable to access private repository. Please check your authentication token.";
  //       } else if (err.message.includes("403")) {
  //         errorMessage =
  //           "Access forbidden. Please verify your permissions for this repository.";
  //       }
  //     }

  //     setError(errorMessage);
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8">
        {/* <AnalysisHeader isAnalyzing={isAnalyzing} error={error} />

        <URLInput
          onAnalyze={handleAnalysis}
          isAnalyzing={isAnalyzing}
          error={error}
        /> */}
      </div>
    </div>
  );
}
