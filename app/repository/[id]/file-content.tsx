"use server";

import { Skeleton } from "@/components/ui/skeleton";
import { parseMdx } from "@/lib/markdown";
import React, { Suspense } from "react";

interface CodeHighlighterProps {
  code: string;
  language: string;
}

const CodeHighlighterSkeleton = () => {
  return (
    <div className="rounded-md">
      <Skeleton className="h-64 w-full rounded-sm" />
    </div>
  );
};

const CodeHighlighter = ({ code, language }: CodeHighlighterProps) => {
  return (
    <Suspense fallback={<CodeHighlighterSkeleton />}>
      <CodeHighlighterContent code={code} language={language} />
    </Suspense>
  );
};

const CodeHighlighterContent = async ({
  code,
  language,
}: CodeHighlighterProps) => {
  // Format content as a markdown code block with language
  const markdown = `\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const { content } = await parseMdx(markdown);
    return <div className="overflow-auto">{content}</div>;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return (
      <pre className="language-text">
        <code>{code}</code>
      </pre>
    );
  }
};

export default CodeHighlighter;
