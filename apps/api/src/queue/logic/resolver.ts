import { prisma } from "@understand-x/database";
import path from "path";
import { getNearestConfig } from "./config-parser";

export async function resolveDependencies(repoId: string, workDir: string) {
  const dependencies = await prisma.dependency.findMany({
    where: { file: { repositoryId: repoId }, resolvedFileId: null },
    include: { file: true },
  });

  const allFiles = await prisma.file.findMany({
    where: { repositoryId: repoId },
  });

  for (const dep of dependencies) {
    // 1. Get aliases SPECIFIC to this file's location in the monorepo
    const localAliases = await getNearestConfig(dep.file.path, workDir);
    let targetPath = dep.importPath;

    // 2. Resolve Aliases
    for (const { alias, target } of localAliases) {
      if (targetPath.startsWith(alias)) {
        targetPath = targetPath.replace(alias, target);
        break;
      }
    }

    // 3. Resolve Relative
    if (dep.importPath.startsWith(".")) {
      const sourceDir = path.dirname(dep.file.path);
      targetPath = path.normalize(path.join(sourceDir, dep.importPath));
    }

    targetPath = targetPath.replace(/\\/g, "/");

    // 4. Match (with extension checking)
    const targetFile = allFiles.find((f) => {
      const normalized = f.path.replace(/\\/g, "/");
      return (
        normalized === targetPath ||
        normalized === `${targetPath}.ts` ||
        normalized === `${targetPath}.tsx` ||
        normalized === `${targetPath}/index.ts`
      );
    });

    if (targetFile) {
      await prisma.dependency.update({
        where: { id: dep.id },
        data: { resolvedFileId: targetFile.id },
      });
    }
  }
}
