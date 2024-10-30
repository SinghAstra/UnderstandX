import { GitHubService } from "@/services/githubService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const githubService = new GitHubService(
      process.env.GITHUB_PUBLIC_ACCESS_TOKEN
    );
    const code = await githubService.fetchRepositoryCode(
      "https://github.com/SinghAstra/DevAssistX"
    );
    return NextResponse.json({ code }, { status: 200 });
  } catch (error) {
    console.log("Error in GET /api/github:", error);
    return NextResponse.json(
      { message: "Failed to fetch repository code" },
      { status: 400 }
    );
  }
}
