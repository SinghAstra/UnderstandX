import { FileWithParsedAnalysisAndCode } from "@/interfaces/github";
import React from "react";

interface FileAnalysisProps {
  file: FileWithParsedAnalysisAndCode;
}

const FileAnalysis = ({ file }: FileAnalysisProps) => {
  return <div>{file.parsedAnalysis}</div>;
};

export default FileAnalysis;
