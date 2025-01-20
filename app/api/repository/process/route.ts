import { authOptions } from "@/lib/auth/auth-options";
import { BatchEmbeddingResponse } from "@/lib/utils/gemini";
import { fetchGitHubRepoMetaData, parseGithubUrl } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { qStash } from "@/lib/utils/qstash";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// const JWT_SECRET = process.env.JWT_SECRET!;

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

    await qStash.publishJSON({
      url: `${process.env.APP_URL}/api/worker/process-repository`,
      body: {
        repositoryId: repository.id,
        githubUrl,
        userId: session.user.id,
      },
      retries: 3,
    });

    console.log("Created new Repository Record");

    // 6. Fetch repository details and data

    return NextResponse.json({
      repositoryId: repository.id,
      status: "PENDING",
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

export async function updateChunksWithEmbeddings(
  chunksForEmbedding: { id: string; content: string }[],
  embeddingResults: BatchEmbeddingResponse[]
) {
  const totalChunks = chunksForEmbedding.length;
  console.log(`Starting sequential database updates for ${totalChunks} chunks`);

  for (let i = 0; i < chunksForEmbedding.length; i++) {
    const chunk = chunksForEmbedding[i];
    const result = embeddingResults[i];

    console.log(`Processing chunk ${i + 1}/${totalChunks}`);
    console.log("result.embeddings.length is ", result.embeddings.length);

    try {
      if (result.embeddings.length > 0) {
        await prisma.repositoryChunk.update({
          where: { id: chunk.id },
          data: { embeddings: result.embeddings },
        });
      } else {
        console.log(
          `Skipping chunk ${chunk.id} due to missing embeddings or error`
        );
      }

      // Optional: Add a small delay between updates if needed
      // await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.log(`Error updating chunk ${chunk.id}:`, error);
      // Log error but continue with next chunk
      continue;
    }
  }

  console.log("All database updates completed");
}

// 6. Generate JWT token for Express API authentication
// const token = sign(
//   {
//     userId: session.user.id,
//     repositoryId: repository.id,
//     exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
//   },
//   JWT_SECRET
// );

// 7. Trigger background processing on Express API
// const triggerResponse = await fetch(
//   `${NEXT_PUBLIC_EXPRESS_API_URL}/api/repository/process`,
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       repositoryId: repository.id,
//       githubUrl,
//     }),
//   }
// );

// if (!triggerResponse.ok) {
//   throw new Error("Failed to trigger background processing");
// }
