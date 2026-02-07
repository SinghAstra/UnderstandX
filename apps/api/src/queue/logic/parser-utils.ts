import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";

const tsParser = new Parser();
tsParser.setLanguage(TypeScript.typescript);

const tsxParser = new Parser();
tsxParser.setLanguage(TypeScript.tsx);

export function getTreeForFile(content: string, extension: string) {
  const parser =
    extension === ".tsx" || extension === ".jsx" ? tsxParser : tsParser;
  return parser.parse(content);
}
