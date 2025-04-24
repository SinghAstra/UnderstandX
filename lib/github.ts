import { Octokit } from "@octokit/rest";

export function parseGithubUrl(url: string) {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;

  if (!url) {
    return { isValid: false, message: "Please enter a GitHub repository URL" };
  }

  const match = url.match(regex);

  try {
    if (!match) {
      return {
        isValid: false,
        message: "Please enter a valid GitHub repository URL.",
      };
    }

    const [, owner, repo] = match;
    return {
      isValid: true,
      owner,
      repo: repo.replace(".git", ""),
    };
  } catch {
    return {
      isValid: false,
      message: "Please enter a valid URL",
    };
  }
}

export async function fetchGitHubRepoMetaData(owner: string, repo: string) {
  try {
    const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

    if (!GITHUB_ACCESS_TOKEN) {
      throw new Error("GITHUB_ACCESS_TOKEN is required.");
    }

    const octokit = new Octokit({
      auth: GITHUB_ACCESS_TOKEN,
    });
    const { data } = await octokit.repos.get({ owner, repo });

    return {
      githubId: data.id,
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      owner: data.owner.login,
      url: data.html_url,
      isPrivate: data.private,
      avatarUrl: data.owner.avatar_url,
      stargazersCount: data.stargazers_count,
      watchersCount: data.watchers_count,
      forksCount: data.forks_count,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.status === 404) {
      console.log("Repository not found.");
      return null;
    }
    console.log("Error fetching repository metadata:", error.message);
    throw error; // Rethrow for handling in the main function
  }
}
