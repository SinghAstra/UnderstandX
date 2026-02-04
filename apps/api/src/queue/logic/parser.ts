import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";

/**
 * This prepares the "Language Reader".
 * It tells the code how to understand TypeScript and JavaScript syntax.
 */
export function createParser() {
  const parser = new Parser();
  // We use the TypeScript grammar as it handles JS perfectly too
  parser.setLanguage(TypeScript.typescript);
  return parser;
}

// Queries find specific things in the code "Tree"
// We want to find:
// 1. imports (what this file needs)
// 2. exports (what this file gives)
export const QUERY_SYMBOLS = `
  (import_statement) @import
  (export_statement) @export
  (lexical_declaration (variable_declarator name: (identifier) @export)) @export_var
  (function_declaration name: (identifier) @export_func) @export_func
`;
