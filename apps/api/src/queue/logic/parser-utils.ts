import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";

const tsParser = new Parser();
tsParser.setLanguage(TypeScript.typescript);

const tsxParser = new Parser();
tsxParser.setLanguage(TypeScript.tsx);

const tsLanguage = TypeScript.typescript;
const tsxLanguage = TypeScript.tsx;

export function getTreeForFile(content: string, extension: string) {
  const parser =
    extension === ".tsx" || extension === ".jsx" ? tsxParser : tsParser;
  return parser.parse(content);
}

export function getLanguageForFile(extension: string) {
  return extension === ".tsx" || extension === ".jsx"
    ? tsxLanguage
    : tsLanguage;
}
