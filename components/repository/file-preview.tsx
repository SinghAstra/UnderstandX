"use client";

import { getFileContent } from "@/app/actions/github";
import { SearchResultFile, SimilarChunk } from "@/interfaces/search-result";
import { cn } from "@/lib/utils/utils";
import { AlertCircle, FileText } from "lucide-react";
import Prism from "prismjs";
import { useEffect, useState } from "react";
import FilePreviewSkeleton from "../skeleton/file-preview-skeleton";
import { Alert, AlertDescription } from "../ui/alert";
// Import commonly used languages
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

interface ChunkPosition {
  chunk: SimilarChunk;
  startIndex: number;
  endIndex: number;
}

function FilePreview({ file, isLoading }: FilePreviewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loadingGithubFileContent, setLoadingGithubFileContent] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chunkPositions, setChunkPositions] = useState<ChunkPosition[]>([]);

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

  const findChunkPositions = (fullContent: string, chunks: SimilarChunk[]) => {
    const positions: ChunkPosition[] = [];

    chunks.forEach((chunk) => {
      const cleanChunkContent = chunk.content.trim();
      const startIndex = fullContent.indexOf(cleanChunkContent);

      if (startIndex !== -1) {
        positions.push({
          chunk,
          startIndex,
          endIndex: startIndex + cleanChunkContent.length,
        });
      }
    });

    return positions.sort((a, b) => a.startIndex - b.startIndex);
  };

  const renderHighlightedContent = () => {
    if (!content || !file) return null;

    // Get syntax highlighted HTML from Prism
    const language = detectLanguage(file.filepath);
    const highlightedCode = Prism.highlight(
      content,
      Prism.languages[language] || Prism.languages.plaintext,
      language
    );

    const segments: { html: string; isHighlighted: boolean }[] = [];
    let currentIndex = 0;

    chunkPositions.forEach((position) => {
      // Add non-highlighted segment before match
      if (position.startIndex > currentIndex) {
        segments.push({
          html: highlightedCode.slice(currentIndex, position.startIndex),
          isHighlighted: false,
        });
      }

      // Add highlighted segment
      segments.push({
        html: highlightedCode.slice(position.startIndex, position.endIndex),
        isHighlighted: true,
      });

      currentIndex = position.endIndex;
    });

    // Add remaining non-highlighted content
    if (currentIndex < highlightedCode.length) {
      segments.push({
        html: highlightedCode.slice(currentIndex),
        isHighlighted: false,
      });
    }

    return segments.map((segment, index) => (
      <span
        key={index}
        className={cn(
          segment.isHighlighted &&
            "match-highlight bg-yellow-100 dark:bg-yellow-900/30"
        )}
        dangerouslySetInnerHTML={{ __html: segment.html }}
      />
    ));
  };

  useEffect(() => {
    async function fetchFileContent() {
      if (!file) {
        setContent(null);
        return;
      }

      setLoadingGithubFileContent(true);
      setError(null);

      try {
        const [owner, repo] = file.repositoryFullName.split("/");
        const { content: fileContent } = await getFileContent(
          owner,
          repo,
          file.filepath
        );

        setContent(fileContent);
        setChunkPositions(findChunkPositions(fileContent, file.similarChunks));
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
  }, [content]);

  if (isLoading || loadingGithubFileContent) {
    return <FilePreviewSkeleton />;
  }

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground gap-3">
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
    <div className="flex flex-col">
      {/* File Content */}
      <div className="relative">
        <pre className="code-preview p-4 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed">
          <code className={`language-${detectLanguage(file.filepath)}`}>
            {renderHighlightedContent()}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default FilePreview;
