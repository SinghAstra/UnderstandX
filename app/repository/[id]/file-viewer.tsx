import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { File } from "@prisma/client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FileViewerProps {
  file: File;
  isFileLoading: boolean;
}

const FileViewer = ({ file, isFileLoading }: FileViewerProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (file?.content) {
      navigator.clipboard.writeText(file.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const getLanguage = () => {
    const ext = file.name.split(".").pop();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "json":
        return "json";
      case "py":
        return "python";
      default:
        return "javascript";
    }
  };

  if (isFileLoading) {
    return (
      <div className="ml-96 w-full p-3">
        <div className="border rounded-lg">
          <div className="border-b flex justify-between items-center py-1 px-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <div className="p-3">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!file) return null;

  return (
    <div className="ml-96 w-full p-3 overflow-hidden">
      <div className="border rounded-lg">
        <div className="border-b flex justify-between items-center overflow-hidden py-1 px-2">
          <h1 className="text-sm font-light">{file.path}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="z-10 h-8 w-8"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="p-3">
          <SyntaxHighlighter
            language={getLanguage()}
            style={oneDark}
            customStyle={{
              background: "transparent",
              lineHeight: "1.3rem",
              borderRadius: "0.75rem",
              paddingRight: "2.5rem",
              letterSpacing: "0.02rem",
              fontFamily: "Fira Code, monospace",
              margin: "0px",
            }}
            wrapLongLines
          >
            {file.content ?? ""}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
