import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParsedFile } from "@/interfaces/github";
import { File } from "@prisma/client";
import {
  AlertCircle,
  Check,
  Code,
  Copy,
  FileQuestion,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { parseFile } from "./action";
import FileAnalysis from "./file-analysis";
import CodeHighlighter from "./file-content";

interface FileViewerProps {
  files: File[];
  selectedFilePath: string;
}

type TabOptions = "code" | "analysis";

export const FileViewer = ({ files, selectedFilePath }: FileViewerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabOptions>("code");
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<ParsedFile | null>(null);

  useEffect(() => {
    const parseFileViewer = async () => {
      setIsLoading(true);
      const matchedFile = files.find((file) => file.path === selectedFilePath);
      if (!matchedFile) {
        setMessage("File not Found");
        return;
      }
      const parsedFile = await parseFile(matchedFile);
      setSelectedFile(parsedFile);
      setIsLoading(false);
    };

    parseFileViewer();
  }, [selectedFilePath, files]);

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

  if (isLoading) {
    return (
      <div className="ml-96 w-full p-3 overflow-hidden">
        <Card className="border rounded-lg">
          <CardHeader className="border-b py-1 px-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-64" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedFile) {
    return (
      <div className="ml-96 w-full p-3 overflow-hidden">
        <Card className="border rounded-lg">
          <CardHeader className="border-b py-3 px-4">
            <CardTitle className="text-base flex items-center">
              <FileQuestion className="h-5 w-5 mr-2" />
              File Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6 px-4">
            <Alert variant="destructive" className="bg-transparent">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-normal mb-1">
                Cannot locate file
              </AlertTitle>
              <AlertDescription className="text-sm opacity-75">
                The file could not be found in the repository. Please select a
                different file from the file tree.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CodeHighlighter parsedCode={selectedFile.parsedCode} />
          ) : (
            <div className="max-w-none prose-invert px-4 py-2">
              <FileAnalysis parsedAnalysis={selectedFile.parsedAnalysis} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
