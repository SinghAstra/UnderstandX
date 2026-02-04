import { prisma } from "@understand-x/database";
import fs from "fs-extra";
import path from "path";

// List of folders we don't want to analyze (Noise Reduction)
const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".vscode",
]);

/**
 * This function walks through the folder we just cloned.
 * 1. It finds a folder -> It creates a "Directory" in the DB.
 * 2. It finds a file -> It creates a "File" in the DB.
 * 3. It repeats this until everything is mapped.
 */
export async function walkAndMap(
  currentPath: string,
  repoId: string,
  rootPath: string,
  parentId: string | null = null
) {
  const entries = await fs.readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden files or ignored folders
    if (entry.name.startsWith(".") || IGNORED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(currentPath, entry.name);
    const relativePath = path.relative(rootPath, fullPath);

    if (entry.isDirectory()) {
      // 1. Save the Folder to the DB
      const dbDir = await prisma.directory.create({
        data: {
          path: relativePath,
          repositoryId: repoId,
          parentId: parentId,
        },
      });

      console.log("dbDir is ", dbDir);

      // 2. Go deeper (Recursion)
      await walkAndMap(fullPath, repoId, rootPath, dbDir.id);
    } else {
      // 3. Save the File to the DB
      const newFile = await prisma.file.create({
        data: {
          name: entry.name,
          path: relativePath,
          repositoryId: repoId,
          directoryId: parentId,
        },
      });

      console.log("newFile is ", newFile);
    }
  }
}
