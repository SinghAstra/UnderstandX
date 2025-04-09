import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileWithParsedAnalysisAndCode } from "@/interfaces/github";
import { Check, Code, Copy, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FileAnalysis from "./file-analysis";
import CodeHighlighter from "./file-content";

interface FileViewerProps {
  file: FileWithParsedAnalysisAndCode;
}

type TabOptions = "code" | "analysis";

export const FileViewer = ({ file }: FileViewerProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOptions>("code");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  const handleCopy = () => {
    if (file?.content && activeTab === "code") {
      navigator.clipboard.writeText(file.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      setMessage(`Copied : ${file.name} (Code)`);
    }
    if (file?.analysis && activeTab === "analysis") {
      navigator.clipboard.writeText(file.analysis);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      setMessage(`Copied : ${file.name} (Analysis)`);
    }
  };

  return (
    <div className="ml-96 w-full p-3 overflow-hidden">
      <div className="border rounded-lg">
        <div className="border-b flex justify-between items-center overflow-hidden py-1 px-2">
          <h1 className="text-sm font-normal tracking-wider">{file.path}</h1>
          <div className="flex items-center space-x-2">
            <Tabs
              defaultValue="code"
              value={activeTab}
              onValueChange={(value: string) =>
                setActiveTab(value as TabOptions)
              }
              className="mr-2 "
            >
              <TabsList className="p-0 h-fit  border-2">
                <TabsTrigger
                  value="code"
                  className="flex items-center text-sm px-2 py-1 tracking-wide font-normal transition-all"
                >
                  <Code className="h-4 w-4 mr-1" />
                  Code
                </TabsTrigger>
                <TabsTrigger
                  value="analysis"
                  className="flex items-center text-sm px-2 py-1 tracking-wide font-normal transition-all"
                  disabled={!file.analysis}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Analysis
                </TabsTrigger>
              </TabsList>
            </Tabs>

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
        </div>

        <div className="py-1 px-4 ">
          {activeTab === "code" ? (
            <CodeHighlighter parsedCode={file.parsedCode} />
          ) : (
            <div className="max-w-none prose-invert px-4 py-2">
              <FileAnalysis file={file} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
