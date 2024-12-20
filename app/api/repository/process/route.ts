import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { fetchGitHubRepoDetails, parseGithubUrl } from "@/lib/utils/github";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import PgBoss from "pg-boss";

const pgBoss = new PgBoss(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { githubUrl } = await req.json();

    // 1. Parse and validate GitHub URL
    const urlInfo = parseGithubUrl(githubUrl);
    if (!urlInfo.isValid || !urlInfo.owner) {
      return NextResponse.json({ error: urlInfo.error }, { status: 400 });
    }

    // 2. Fetch repository details from GitHub API
    const repoDetails = await fetchGitHubRepoDetails(
      urlInfo.owner,
      urlInfo.repo
    );

    // 3. Check if repository already exists using GitHub ID
    const existingRepo = await prisma.repository.findUnique({
      where: {
        githubId: repoDetails.githubId,
      },
    });

    if (existingRepo) {
      // Update the URL if it has changed
      if (existingRepo.url !== repoDetails.url) {
        await prisma.repository.update({
          where: { id: existingRepo.id, userId: session.user.id },
          data: {
            url: repoDetails.url,
            name: repoDetails.name,
            fullName: repoDetails.fullName,
          },
        });
      }

      return NextResponse.json({
        repositoryId: existingRepo.id,
        status: existingRepo.status,
      });
    }

    // 4. Create new repository record
    const newRepo = await prisma.repository.create({
      data: {
        githubId: repoDetails.githubId,
        name: repoDetails.name,
        fullName: repoDetails.fullName,
        description: repoDetails.description,
        owner: repoDetails.owner,
        url: repoDetails.url,
        status: "PENDING",
        userId: session.user.id,
      },
    });

    // 5. Queue initial processing job
    await pgBoss.send("process-repository", {
      repositoryId: newRepo.id,
      userId: session.user.id,
      githubUrl: repoDetails.url,
      isPrivate: repoDetails.isPrivate,
    });

    return NextResponse.json({
      repositoryId: newRepo.id,
      status: "PENDING",
    });
  } catch (error) {
    console.log("Error processing repository:", error);
    return NextResponse.json(
      { error: "Failed to process repository" },
      { status: 500 }
    );
  }
}
