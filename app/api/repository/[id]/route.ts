import { DirectoryWithRelations } from "@/interfaces/github";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("id is ", id);
    console.log("session.user.id is ", session.user.id);

    // Fetch repository with user check
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

    // If repository doesn't exist or doesn't belong to user
    if (!repository) {
      return new NextResponse("Repository not found", { status: 404 });
    }

    // Convert to hierarchical structure
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

    // Attach files to their respective directories
    repository.files.forEach((file) => {
      const fileObj = {
        path: file.path,
        shortSummary: file.shortSummary,
      };
      console.log("fileObj is ", fileObj);

      if (file.directoryId) {
        directoryMap.get(file.directoryId)?.files.push(file);
      }
    });

    // Final structured response
    const structuredRepository = {
      ...repository,
      directories: rootDirectories, // Nested directories with children
      files: repository.files, // Repo-level files
    };

    return NextResponse.json({ repository: structuredRepository });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    } else {
      console.log("Unknown error:", error);
    }
    console.log("error -- get /repository/:repositoryId");
    return new NextResponse("Internal error", { status: 500 });
  }
}
