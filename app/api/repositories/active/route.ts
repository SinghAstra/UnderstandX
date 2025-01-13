import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { RepositoryStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Get the authenticated user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user ID from the session
    const userId = session.user.id;

    // 3. Query repositories for the authenticated user
    // Get all repositories that are in an "active" state
    // Active states are those where processing is ongoing
    const activeRepositories = await prisma.repository.findMany({
      where: {
        userId: userId,
        status: {
          in: [
            RepositoryStatus.PENDING,
            RepositoryStatus.FETCHING_GITHUB_REPO_FILES,
            RepositoryStatus.CHUNKING_FILES,
            RepositoryStatus.EMBEDDING_CHUNKS,
          ],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // 4. Return the response
    return NextResponse.json({
      hasActiveRepositories: activeRepositories.length > 0,
      repositories: activeRepositories,
    });
  } catch (error) {
    // 5. Error handling

    console.log("Fetch User All Active Repository error.");
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
