import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/lib/markdown";
import { File } from "@prisma/client";
import { Check, Code, Copy, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FileViewerProps {
  selectedFile: File;
}

type TabOptions = "code" | "analysis";

export const FileViewer = ({ selectedFile }: FileViewerProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOptions>("code");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  const handleCopy = () => {
    if (selectedFile?.content && activeTab === "code") {
      navigator.clipboard.writeText(selectedFile.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      setMessage(`Copied : ${selectedFile.name} (Code)`);
    }
    if (selectedFile?.analysis && activeTab === "analysis") {
      navigator.clipboard.writeText(selectedFile.analysis);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      setMessage(`Copied : ${selectedFile.name} (Analysis)`);
    }
  };

  const fileExtension =
    selectedFile.name.split(".")[selectedFile.name.split(".").length - 1];

  const parsedCode = `\`\`\`${fileExtension}\n${selectedFile.content}\n\`\`\``;

  return (
    <div className="ml-96 w-full p-3 overflow-hidden">
      <div className="border rounded-lg">
        <div className="border-b flex justify-between items-center overflow-hidden py-1 px-2">
          <h1 className="text-sm font-normal tracking-wider">
            {selectedFile.path}
          </h1>
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
                  disabled={!selectedFile.analysis}
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
            <Markdown>{parsedCode}</Markdown>
          ) : (
            <div className="max-w-none prose-invert px-4 py-2">
              <Markdown>{selectedFile.analysis ?? "No Analysis"}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
