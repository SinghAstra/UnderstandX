export const EXPORT_QUERY = `
  (export_statement
    declaration: [
      (function_declaration name: (identifier) @name)
      (class_declaration name: (identifier) @name)
      (lexical_declaration (variable_declarator name: (identifier) @name))
    ]
  ) @export
`;

export const IMPORT_QUERY = `
  (import_statement
    source: (string (string_fragment) @path)
  )
`;
