import { authOptions } from "@/lib/auth/auth-options";
import { fetchGitHubRepoDetails, parseGithubUrl } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

    console.log("repoDetails is ", repoDetails);

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

      if (existingRepo.status === "PENDING") {
        console.log("Deleted existing repository with status PENDING");
        await prisma.repository.delete({
          where: {
            id: existingRepo.id,
            userId: session.user.id,
          },
        });
      } else {
        return NextResponse.json({
          repositoryId: existingRepo.id,
          status: existingRepo.status,
        });
      }
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
