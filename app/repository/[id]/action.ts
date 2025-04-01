"use server";
import { DirectoryWithRelations } from "@/interfaces/github";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { serialize } from "next-mdx-remote/serialize";

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

    // Attach files to directories
    repository.files.forEach((file) => {
      if (file.directoryId) {
        directoryMap.get(file.directoryId)?.files.push(file);
      }
    });

    // Create structured repository
    const structuredRepository = {
      ...repository,
      directories: rootDirectories,
      files: repository.files,
    };

    // Pre-serialize MDX content if needed
    let mdxSource = null;
    if (repository.overview) {
      mdxSource = await serialize(repository.overview);
    }

    return {
      ...structuredRepository,
      serializedOverview: mdxSource,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}
