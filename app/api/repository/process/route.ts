import { authOptions } from "@/lib/auth-options";
import { fetchGitHubRepoMetaData, parseGithubUrl } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { createServiceToken } from "@/lib/utils/serviceAuth";
import { RepositoryStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Get and validate input
    const body = await req.json();
    const { githubUrl } = body;

    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL is required" },
        { status: 400 }
      );
    }

    // 3. Parse and validate GitHub URL
    const urlInfo = parseGithubUrl(githubUrl);
    if (!urlInfo.isValid || !urlInfo.owner) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    // 4. Fetch repository MetaData from GitHub API
    const repoDetails = await fetchGitHubRepoMetaData(
      urlInfo.owner,
      urlInfo.repo
    );

    console.log("Fetched Repo Details");
    console.log("userId is ", session.user.id);

    // 5. Create new repository record
    const repository = await prisma.repository.create({
      data: {
        githubId: repoDetails.githubId,
        name: repoDetails.name,
        owner: repoDetails.owner,
        url: repoDetails.url,
        status: "PENDING",
        userId: session.user.id,
        avatarUrl: repoDetails.avatarUrl,
      },
    });

    const serviceToken = createServiceToken({
      repositoryId: repository.id,
      userId: session.user.id,
      githubUrl,
    });

    console.log(
      "api url is ",
      `${process.env.EXPRESS_API_URL}/api/queue/repository`
    );

    const response = await fetch(
      `${process.env.EXPRESS_API_URL}/api/queue/repository`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceToken}`,
        },
      }
    );

    const data = await response.json();

    console.log("data --express api is ", data);

    console.log("Created new Repository Record");

    // 6. Fetch repository details and data
    return NextResponse.json({
      repositoryId: repository.id,
      status: RepositoryStatus.PENDING,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    } else {
      console.log("Unknown error:", error);
    }
    console.log("error -- get /repository/process");
    return NextResponse.json(
      { error: "Failed to process repository" },
      { status: 500 }
    );
  }
}
