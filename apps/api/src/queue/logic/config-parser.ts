import { logError } from "@/utils/logger";
import fs from "fs-extra";
import { parse } from "jsonc-parser";
import path from "path";

export interface PathAlias {
  alias: string; // e.g., "@/*"
  target: string; // e.g., "src/*"
}

// apps/api/src/queue/logic/config-parser.ts

export async function getNearestConfig(
  filePath: string,
  workDir: string
): Promise<PathAlias[]> {
  let currentDir = path.dirname(path.join(workDir, filePath));

  // Bubble up until we reach the workDir (root of the repo)
  while (currentDir.startsWith(workDir)) {
    const configPath = path.join(currentDir, "tsconfig.json");

    if (await fs.pathExists(configPath)) {
      const aliases = await parseConfig(configPath, currentDir, workDir);
      if (aliases.length > 0) return aliases;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break; // Reached system root
    currentDir = parentDir;
  }

  return [];
}

async function parseConfig(
  configPath: string,
  configDir: string,
  workDir: string
): Promise<PathAlias[]> {
  const content = await fs.readFile(configPath, "utf8");
  const config = parse(content);
  const paths = config?.compilerOptions?.paths;
  if (!paths) return [];

  // Crucial: We must make the target relative to the ROOT (workDir),
  // not the local folder where tsconfig sits.
  const configRelDir = path.relative(workDir, configDir);

  return Object.entries(paths).map(([alias, targets]) => ({
    alias: alias.replace("/*", ""),
    target: path.join(configRelDir, (targets as string[])[0].replace("/*", "")),
  }));
}
