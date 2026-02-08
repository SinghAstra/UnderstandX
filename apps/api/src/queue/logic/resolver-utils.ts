import fs from "fs-extra";
import path from "path";

export async function getNearestConfig(fileDir: string, workDir: string) {
  let current = fileDir;
  while (current.startsWith(workDir)) {
    const configPath = path.join(current, "tsconfig.json");
    if (await fs.pathExists(configPath)) {
      return await fs.readJson(configPath);
    }
    current = path.dirname(current);
  }
  return null;
}

export function resolveImportPath(
  importPath: string,
  sourceFilePath: string,
  aliases: Record<string, string[]>
) {
  for (const [alias, paths] of Object.entries(aliases)) {
    const aliasBase = alias.replace("/*", "");
    if (importPath.startsWith(aliasBase)) {
      const actualSubPath = paths[0].replace("/*", "");
      return importPath.replace(aliasBase, actualSubPath);
    }
  }

  if (importPath.startsWith(".")) {
    const sourceDir = path.dirname(sourceFilePath);
    return path.join(sourceDir, importPath);
  }

  return importPath;
}
