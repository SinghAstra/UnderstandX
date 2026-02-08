import { prisma } from "@understand-x/database";
import Parser from "tree-sitter";
import { getLanguageForFile, getTreeForFile } from "./parser-utils";
import { EXPORT_QUERY, IMPORT_QUERY } from "./queries";
import { reportStatus } from "./reporter";

export async function analyzeCodebase(repoId: string) {
  const files = await prisma.file.findMany({
    where: { repositoryId: repoId },
  });

  await reportStatus(
    repoId,
    `Analyzing ${files.length} files...`,
    "PROCESSING"
  );

  for (const file of files) {
    if (![".ts", ".tsx", ".js", ".jsx"].includes(file.extension)) continue;

    const content = file.content || "";
    if (!content) continue;

    const tree = getTreeForFile(content, file.extension);

    await extractSymbols(file.id, file.extension, tree);

    await extractDependencies(file.id, file.extension, tree);
  }

  await reportStatus(
    repoId,
    "Analysis complete. Nervous system mapped.",
    "COMPLETED"
  );
}

async function extractSymbols(
  fileId: string,
  extension: string,
  tree: Parser.Tree
) {
  const language = getLanguageForFile(extension);

  const query = new Parser.Query(language, EXPORT_QUERY);
  const matches = query.matches(tree.rootNode);

  for (const match of matches) {
    const nameNode = match.captures.find((c) => c.name === "name")?.node;
    const typeNode = match.captures.find((c) => c.name === "export")?.node;

    if (nameNode) {
      await prisma.symbol.create({
        data: {
          fileId,
          name: nameNode.text,
          type: typeNode?.type || "unknown",
        },
      });
    }
  }
}

async function extractDependencies(
  fileId: string,
  extension: string,
  tree: Parser.Tree
) {
  const language = getLanguageForFile(extension);

  const query = new Parser.Query(language, IMPORT_QUERY);
  const matches = query.matches(tree.rootNode);

  for (const match of matches) {
    const pathNode = match.captures.find((c) => c.name === "path")?.node;

    if (pathNode) {
      await prisma.dependency.create({
        data: {
          fileId,
          importPath: pathNode.text.replace(/['"]/g, ""),
          sourceValue: pathNode.parent?.text || "",
        },
      });
    }
  }
}
