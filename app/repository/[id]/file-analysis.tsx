import { FileWithParsedAnalysis } from "@/interfaces/github";
import React from "react";

interface FileAnalysisProps {
  file: FileWithParsedAnalysis;
}

const FileAnalysis = ({ file }: FileAnalysisProps) => {
  return <div>{file.parsedAnalysis}</div>;
};

export default FileAnalysis;
