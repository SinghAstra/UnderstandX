import { authOptions } from "@/lib/auth/auth-options";
import { batchGenerateEmbeddings } from "@/lib/utils/gemini";
import {
  fetchGitHubRepoData,
  fetchGitHubRepoMetaData,
  parseGithubUrl,
} from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { processFilesIntoChunks } from "@/lib/utils/repository";
import { RepositoryStatus } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
const EXPRESS_API_URL = process.env.EXPRESS_API_URL!;

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

    console.log("githubUrl is ", githubUrl);

    // 3. Parse and validate GitHub URL
    const urlInfo = parseGithubUrl(githubUrl);
    if (!urlInfo.isValid || !urlInfo.owner) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    console.log("urlInfo is ", urlInfo);

    // 4. Fetch repository MetaData from GitHub API
    const repoDetails = await fetchGitHubRepoMetaData(
      urlInfo.owner,
      urlInfo.repo
    );

    console.log("Fetched Repo Details");

    // 5. Create new repository record
    const repository = await prisma.repository.create({
      data: {
        githubId: repoDetails.githubId,
        name: repoDetails.name,
        fullName: repoDetails.fullName,
        description: repoDetails.description,
        owner: repoDetails.owner,
        url: githubUrl,
        status: "PENDING",
        userId: session.user.id,
        avatarUrl: repoDetails.avatarUrl,
      },
    });

    console.log("Created new Repository Record");
    console.log("JWT_SECRET is ", JWT_SECRET);

    // 6. Generate JWT token for Express API authentication
    const token = sign(
      {
        userId: session.user.id,
        repositoryId: repository.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
      },
      JWT_SECRET
    );

    // 7. Trigger background processing on Express API
    const triggerResponse = await fetch(
      `${EXPRESS_API_URL}/api/repository/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          repositoryId: repository.id,
          githubUrl,
        }),
      }
    );

    if (!triggerResponse.ok) {
      throw new Error("Failed to trigger background processing");
    }

    // 6. Return immediate response
    return NextResponse.json({
      repositoryId: repository.id,
      token,
      sseUrl: `${EXPRESS_API_URL}/api/repository/${repository.id}/process/stream`,
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
