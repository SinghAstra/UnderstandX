"use client";

import { getFileContent } from "@/app/actions/github";
import { SearchResultFile, SimilarChunk } from "@/interfaces/search-result";
import { cn } from "@/lib/utils/utils";
import { AlertCircle, FileText, X } from "lucide-react";
import Prism from "prismjs";
import { useEffect, useState } from "react";
import FilePreviewSkeleton from "../skeleton/file-preview-skeleton";
import { Alert, AlertDescription } from "../ui/alert";
// Import commonly used languages
import { usePathname, useRouter } from "next/navigation";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";

interface FilePreviewProps {
  file?: SearchResultFile;
  isLoading?: boolean;
}

function FilePreview({ file, isLoading }: FilePreviewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loadingGithubFileContent, setLoadingGithubFileContent] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Function to detect language from file extension
  const detectLanguage = (filepath: string): string => {
    const extension = filepath.split(".").pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      ts: "typescript",
      tsx: "tsx",
      js: "javascript",
      jsx: "jsx",
      css: "css",
      json: "json",
      md: "markdown",
    };
    return languageMap[extension || ""] || "plaintext";
  };

  const findMatchingLines = (
    fileContent: string,
    chunks: SimilarChunk[]
  ): Set<number> => {
    const lines = fileContent.split("\n");
    const matchedLines = new Set<number>();

    chunks.forEach((chunk) => {
      const chunkContent = chunk.content.trim();
      let startLine = -1;

      // Find the starting line of the chunk
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(chunkContent.split("\n")[0])) {
          startLine = i;
          break;
        }
      }

      if (startLine !== -1) {
        // Add all lines that are part of this chunk
        const chunkLines = chunkContent.split("\n");
        for (let i = 0; i < chunkLines.length; i++) {
          if (startLine + i < lines.length) {
            // Verify the line actually contains the chunk content
            if (lines[startLine + i].includes(chunkLines[i])) {
              matchedLines.add(startLine + i);
            }
          }
        }
      }
    });

    return matchedLines;
  };

  // Render the content with highlighting
  const renderHighlightedContent = (
    fileContent: string,
    chunks: SimilarChunk[]
  ) => {
    const lines = fileContent.split("\n");
    console.log("lines.length is ", lines.length);
    const matchedLines = findMatchingLines(fileContent, chunks);
    console.log("matchedLines.length is ", matchedLines.size);
    const language = detectLanguage(file?.filepath || "");

    const highlightedContent = lines.map((line, index) => {
      const highlighted = Prism.highlight(
        line,
        Prism.languages[language] || Prism.languages.plaintext,
        language
      );

      return (
        <div
          key={index}
          className={cn("", matchedLines.has(index) && "bg-yellow-900/30")}
        >
          {/* Line number */}
          <span className=" w-12 select-none text-right pl-2 pr-4 text-slate-500">
            {index + 1}
          </span>{" "}
          {/* Code content */}
          <span
            className="flex-1 pr-4"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      );
    });

    return (
      <pre className="code-preview font-mono text-sm leading-6 px-4 py-2 ">
        <code>{highlightedContent}</code>
      </pre>
    );
  };

  useEffect(() => {
    async function fetchFileContent() {
      if (!file) {
        setContent(null);
        setIsContentReady(false);
        return;
      }

      setLoadingGithubFileContent(true);
      setError(null);
      setIsContentReady(false);

      try {
        const [owner, repo] = file.repositoryFullName.split("/");
        const { content: fileContent } = await getFileContent(
          owner,
          repo,
          file.filepath
        );

        setContent(fileContent);
      } catch (err) {
        setError("Failed to load file content. Please try again.");
        console.error("Error loading file:", err);
      } finally {
        setLoadingGithubFileContent(false);
      }
    }

    fetchFileContent();
  }, [file]);

  useEffect(() => {
    if (content) {
      Prism.highlightAll();
    }
  }, [content, isContentReady]);

  if (isLoading || loadingGithubFileContent) {
    return <FilePreviewSkeleton />;
  }

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
        <FileText className="w-8 h-8 text-muted-foreground/50" />
        <div className="text-sm">Select a file to preview</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col border rounded-md flex-1">
      <div className="sticky top-0 z-10 flex items-center justify-between p-2 bg-background/80 backdrop-blur-sm border-b">
        <div className="text-sm text-muted-foreground truncate">
          {file.filepath}
        </div>
        <button
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            params.delete("file");
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="p-2 hover:bg-accent rounded-md transition-colors"
          aria-label="Close file preview"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-auto relative">
        <div className="min-w-max">
          {content && renderHighlightedContent(content, file.similarChunks)}
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
