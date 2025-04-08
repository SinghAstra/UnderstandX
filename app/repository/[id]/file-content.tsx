import React from "react";

interface CodeHighlighterProps {
  code: string;
  language: string;
}

const CodeHighlighter = async ({ code, language }: CodeHighlighterProps) => {
  // Format content as a markdown code block with language
  const markdown = `\`\`\`${language}\n${code}\n\`\`\``;

  return (
    <pre className="language-text">
      <code>{markdown}</code>
    </pre>
  );
};

export default CodeHighlighter;
