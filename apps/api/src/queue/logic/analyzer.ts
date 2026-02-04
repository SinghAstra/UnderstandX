import { logError } from "@/utils/logger";
import { prisma } from "@understand-x/database";
import fs from "fs-extra";
import path from "path";
import { QueryCapture } from "tree-sitter";
import { extractPathFromImport } from "./helper";
import { createParser, QUERY_SYMBOLS } from "./parser";

export async function analyzeCodebase(workDir: string, repoId: string) {
  const parser = createParser();
  // Compile the query once outside the loop for performance
  const query = parser.getLanguage().query(QUERY_SYMBOLS);

  const files = await prisma.file.findMany({ where: { repositoryId: repoId } });

  for (const file of files) {
    if (!/\.(ts|js|tsx|jsx)$/.test(file.name)) continue;

    try {
      const sourceCode = await fs.readFile(
        path.join(workDir, file.path),
        "utf8"
      );
      const tree = parser.parse(sourceCode);
      // Execute the query on the root of the file
      const captures: QueryCapture[] = query.captures(tree.rootNode);

      const dependencyData: any[] = [];
      const symbolData: any[] = [];

      // Process captures by their @name defined in the query
      captures.forEach((capture) => {
        const { name, node } = capture;

        if (name === "import") {
          dependencyData.push({
            importPath: extractPathFromImport(node.text),
            sourceValue: node.text,
            fileId: file.id,
          });
        }

        if (["export", "export_var", "export_func"].includes(name)) {
          // If it's a specific func/var name, it's more precise than the whole block
          symbolData.push({
            name: node.text.replace(/['";]/g, ""), // Clean up any trailing punctuation
            type: name,
            fileId: file.id,
          });
        }
      });

      console.log("dependencyData is ", dependencyData);
      console.log("symbolData is ", symbolData);

      // Atomic Transaction for Data Integrity
      await prisma.$transaction([
        prisma.dependency.createMany({ data: dependencyData }),
        prisma.symbol.createMany({ data: symbolData }),
        prisma.file.update({
          where: { id: file.id },
          data: { content: sourceCode },
        }),
      ]);
    } catch (err) {
      logError(err);
      console.error(`Failed: ${file.path}`, err);
    }
  }
}
