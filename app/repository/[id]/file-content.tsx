import { JSXElementConstructor, ReactElement } from "react";

interface CodeHighlighterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedCode: ReactElement<any, string | JSXElementConstructor<any>> | null;
}

const CodeHighlighter = ({ parsedCode }: CodeHighlighterProps) => {
  return parsedCode;
};

export default CodeHighlighter;
