import React, { JSXElementConstructor, ReactElement } from "react";

interface FileAnalysisProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedAnalysis: ReactElement<any, string | JSXElementConstructor<any>> | null;
}

const FileAnalysis = ({ parsedAnalysis }: FileAnalysisProps) => {
  return <div className="pt-8 pb-4">{parsedAnalysis}</div>;
};

export default FileAnalysis;
