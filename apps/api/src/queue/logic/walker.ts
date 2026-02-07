import { prisma } from "@understand-x/database";
import fs from "fs-extra";
import path from "path";

export async function scanDirectory(
  currentPath: string,
  repoId: string,
  parentId: string | null = null,
  workDir: string
) {
  const entries = await fs.readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);

    const relativePath = path.relative(workDir, fullPath);

    if (["node_modules", ".git", "dist", "build"].includes(entry.name))
      continue;

    if (entry.isDirectory()) {
      const dir = await prisma.directory.create({
        data: {
          name: entry.name,
          path: relativePath,
          repositoryId: repoId,
          parentId: parentId,
        },
      });

      await scanDirectory(fullPath, repoId, dir.id, workDir);
    } else {
      await prisma.file.create({
        data: {
          name: entry.name,
          path: relativePath,
          extension: path.extname(entry.name),
          repositoryId: repoId,
          directoryId: parentId,
        },
      });
    }
  }
}
