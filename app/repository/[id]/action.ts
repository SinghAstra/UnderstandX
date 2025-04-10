"use server";
import { DirectoryWithRelations } from "@/interfaces/github";
import { authOptions } from "@/lib/auth-options";
import { parseMdx } from "@/lib/markdown";
import { getLanguage } from "@/lib/utils";
import { prisma } from "@/lib/utils/prisma";
import { File } from "@prisma/client";
import { getServerSession } from "next-auth";
import { extname } from "path";
import { JSXElementConstructor, ReactElement } from "react";

export async function getRepositoryData(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  try {
    const repository = await prisma.repository.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        directories: true,
        files: true,
      },
    });

    if (!repository) {
      return null;
    }

    const directoryMap = new Map();
    const rootDirectories: DirectoryWithRelations[] = [];
    const rootFiles: File[] = [];

    // Initialize directory map
    repository.directories.forEach((dir) => {
      directoryMap.set(dir.id, { ...dir, children: [], files: [] });
    });

    // Build hierarchy
    repository.directories.forEach((dir) => {
      if (dir.parentId) {
        directoryMap.get(dir.parentId)?.children.push(directoryMap.get(dir.id));
      } else {
        rootDirectories.push(directoryMap.get(dir.id));
      }
    });

    repository.files.map(async (file) => {
      if (file.directoryId) {
        directoryMap.get(file.directoryId).files.push(file);
      } else {
        rootFiles.push(file);
      }
    });

    const { content: parsedOverview } = await parseMdx(
      repository.overview ?? "Overview not available. Please try again."
    );

    // Create structured repository
    const structuredRepository = {
      ...repository,
      directories: rootDirectories,
      rootFiles,
      files: repository.files,
      parsedOverview,
    };

    return structuredRepository;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}

export async function parseFile(file: File) {
  console.log("Starting to parse the file ", file.path);
  const { content: parsedAnalysis } = await parseMdx(
    file.analysis ?? "Analysis not available. Please try again."
  );
  console.log("parsedAnalysis generated for ", file.path);
  const ext = extname(file.path);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsedCode: ReactElement<any, string | JSXElementConstructor<any>> | null;

  if (ext === ".md") {
    const { content } = await parseMdx(
      "This is a markdown file. It has no code."
    );
    parsedCode = content;
  } else {
    const language = getLanguage(file);
    const markdown = `\`\`\`${language}\n${file.content}\n\`\`\``;
    const { content } = await parseMdx(markdown);
    parsedCode = content;
  }
  console.log("parsedCode generated for ", file.path);
  return { ...file, parsedAnalysis, parsedCode };
}
