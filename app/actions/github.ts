"use server";

import { Octokit } from "@octokit/rest";

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  ref: string = "main"
) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  console.log("owner is ", owner);
  console.log("repo is ", repo);

  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    // GitHub returns content as base64
    if ("content" in response.data && !Array.isArray(response.data)) {
      const decodedContent = Buffer.from(
        response.data.content,
        "base64"
      ).toString();
      return {
        content: decodedContent,
        sha: response.data.sha,
      };
    }

    throw new Error("Not a file");
  } catch (error) {
    console.error("Error fetching file content:", error);
    throw error;
  }
}
