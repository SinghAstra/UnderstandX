"use server";
import {
  DirectoryWithRelations,
  FileWithParsedAnalysisAndCode,
} from "@/interfaces/github";
import { authOptions } from "@/lib/auth-options";
import { parseMdx } from "@/lib/markdown";
import { getLanguage } from "@/lib/utils";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";

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
    const rootFiles: FileWithParsedAnalysisAndCode[] = [];

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

    await Promise.all(
      repository.files.map(async (file) => {
        const { content: parsedAnalysis } = await parseMdx(
          file.analysis ?? "Analysis not available. Please try again."
        );
        const language = getLanguage(file);
        const markdown = `\`\`\`${language}\n${file.content}\n\`\`\``;
        const { content: parsedCode } = await parseMdx(markdown);
        const fileWithParsedAnalysisAndCode = {
          ...file,
          parsedCode,
          parsedAnalysis,
        };
        if (file.directoryId) {
          directoryMap
            .get(file.directoryId)
            ?.files.push(fileWithParsedAnalysisAndCode);
        } else {
          rootFiles.push(fileWithParsedAnalysisAndCode);
        }
      })
    );

    const { content } = await parseMdx(
      repository.overview ?? "Overview not available. Please try again."
    );

    // Create structured repository
    const structuredRepository = {
      ...repository,
      directories: rootDirectories,
      files: rootFiles,
      parsedOverview: content,
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
