import { prisma } from "@understand-x/database";
import { getNearestConfig, resolveImportPath } from "./resolver-utils";

export async function resolveDependencies(repoId: string, workDir: string) {
  const dependencies = await prisma.dependency.findMany({
    where: { file: { repositoryId: repoId } },
    include: { file: true },
  });

  for (const dep of dependencies) {
    const config = await getNearestConfig(dep.file.path, workDir);
    const aliases = config?.compilerOptions?.paths || {};

    const predictedPath = resolveImportPath(
      dep.importPath,
      dep.file.path,
      aliases
    );

    const possiblePaths = [
      predictedPath,
      `${predictedPath}.ts`,
      `${predictedPath}.tsx`,
      `${predictedPath}/index.ts`,
      `${predictedPath}/index.tsx`,
    ];

    const targetFile = await prisma.file.findFirst({
      where: {
        repositoryId: repoId,
        path: { in: possiblePaths },
      },
    });

    if (targetFile) {
      await prisma.dependency.update({
        where: { id: dep.id },
        data: { resolvedFileId: targetFile.id },
      });
    }
  }
}
