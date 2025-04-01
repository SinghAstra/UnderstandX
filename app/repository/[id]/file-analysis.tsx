import { parseMdx } from "@/lib/markdown";
import React from "react";

interface FileAnalysisProps {
  analysis: string;
}

const FileAnalysis = async ({ analysis }: FileAnalysisProps) => {
  const response = await parseMdx(analysis);
  return <div>{response.content}</div>;
};

export default FileAnalysis;
