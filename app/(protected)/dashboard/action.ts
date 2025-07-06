"use server";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function fetchRepositories() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required", repositories: [] };
    }

    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { repositories };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Fetch Repositories", repositories: [] };
  }
}

export async function fetchTrendingTypeScriptRepos() {
  // Calculate date 7 days ago in YYYY-MM-DD format
  const now = new Date();
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);
  const since = lastWeek.toISOString().slice(0, 10);

  // Construct the search query
  const query = ["language:typescript", `created:>${since}`].join("+");

  const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=20`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  // Return the array of repositories
  return data.items;
}
