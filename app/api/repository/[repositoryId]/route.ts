import { authOptions } from "@/lib/auth/auth-options";
import { fetchGitHubRepoDetails } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ repositoryId: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  try {
    const { repositoryId } = await props.params;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("repositoryId is ", repositoryId);
    console.log("session.user.id is ", session.user.id);

    // Fetch repository with user check
    const repository = await prisma.repository.findUnique({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    // If repository doesn't exist or doesn't belong to user
    if (!repository) {
      return new NextResponse("Repository not found", { status: 404 });
    }

    const githubData = await fetchGitHubRepoDetails(
      repository.owner,
      repository.name
    );

    return NextResponse.json({
      repository,
      githubStats: {
        stargazers_count: githubData.stargazersCount,
        watchers_count: githubData.watchersCount,
        forks_count: githubData.forksCount,
      },
    });
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
