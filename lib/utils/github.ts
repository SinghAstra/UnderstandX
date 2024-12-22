import { GitHubFile, GitHubRepoData } from "@/types/github";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export interface GitHubSuccessResponse extends GitHubRepoData {
  success: boolean;
  error?: string;
}

export interface GitHubErrorResponse {
  error: string;
  success: false;
}

export type GitHubRepoResponse = GitHubSuccessResponse | GitHubErrorResponse;

export function parseGithubUrl(url: string) {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;

  if (!url) {
    return { isValid: false, error: "Please enter a GitHub repository URL" };
  }

  const match = url.match(regex);

  try {
    if (!match) {
      return {
        isValid: false,
        error:
          "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)",
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
      error: "Please enter a valid URL",
    };
  }
}

export async function fetchGitHubRepoDetails(owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Repository not found");
    }
    throw new Error("Failed to fetch repository details");
  }

  const data = await response.json();
  return {
    githubId: data.id,
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    owner: data.owner.login,
    url: data.html_url,
    isPrivate: data.private,
    avatarUrl: data.owner.avatar_url,
  };
}

export async function fetchGitHubRepoData(
  url: string,
  isPrivate: boolean
): Promise<GitHubRepoResponse> {
  const { owner, repo, isValid, error } = parseGithubUrl(url);
  console.log("isPrivate --fetchGitHubRepoData is ", isPrivate);

  if (!isValid || !owner) {
    return {
      success: false,
      error: error ? error : "Failed to Fetch GitHub Repository Data.",
    };
  }

  // Fetch repository metadata
  const { data: repoData } = await octokit.repos.get({
    owner,
    repo,
  });

  // Fetch repository content
  const files = await fetchRepositoryContent(
    owner,
    repo,
    repoData.default_branch
  );

  console.log("files.length --fetchRepositoryContent is ", files.length);

  return {
    ...repoData,
    files,
    success: true,
  };
}

async function fetchRepositoryContent(
  owner: string,
  repo: string,
  branch: string,
  path: string = ""
): Promise<GitHubFile[]> {
  const files: GitHubFile[] = [];

  try {
    console.log("Inside fetchRepositoryContent");
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    for (const item of Array.isArray(contents) ? contents : [contents]) {
      if (item.type === "file" && isProcessableFile(item.name)) {
        const { data: fileData } = await octokit.repos.getContent({
          owner,
          repo,
          path: item.path,
          ref: branch,
        });

        if ("content" in fileData) {
          files.push({
            name: item.name,
            path: item.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
            type: getFileType(item.name),
          });
        }
      } else if (item.type === "dir") {
        const subFiles = await fetchRepositoryContent(
          owner,
          repo,
          branch,
          item.path
        );
        files.push(...subFiles);
      }
    }
  } catch (error) {
    console.log(`Error fetching content for ${owner}/${repo}/${path}:`, error);
  }

  return files;
}

function isProcessableFile(filename: string): boolean {
  const processableExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".hpp",
    ".cs",
    ".go",
    ".rb",
    ".php",
    ".swift",
    ".kt",
    ".rs",
    ".md",
    ".txt",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".css",
    ".scss",
    ".less",
    ".html",
    ".xml",
    ".sql",
    ".sh",
    ".bash",
    ".zsh",
    ".fish",
  ];

  const extension = filename.toLowerCase().split(".").pop();
  return extension ? processableExtensions.includes(`.${extension}`) : false;
}

function getFileType(filename: string): string {
  const extension = filename.toLowerCase().split(".").pop() || "";
  return extension;
}
