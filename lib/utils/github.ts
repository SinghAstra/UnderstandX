import { GitHubFile } from "@/interfaces/github";
import { Octokit } from "@octokit/rest";
import { sendProcessingUpdate } from "../pusher/send-update";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

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
        error: "Please enter a valid GitHub repository URL.",
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

export async function fetchGitHubRepoMetaData(owner: string, repo: string) {
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
    stargazersCount: data.stargazers_count,
    watchersCount: data.watchers_count,
    forksCount: data.forks_count,
  };
}

export async function fetchGitHubRepoData(
  url: string,
  isPrivate: boolean,
  repositoryId: string
) {
  const { owner, repo, isValid } = parseGithubUrl(url);
  console.log("isPrivate --fetchGitHubRepoData is ", isPrivate);

  if (!isValid || !owner) {
    throw new Error("Failed to fetch GitHubRepoData");
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
    repoData.default_branch,
    "",
    repositoryId
  );

  console.log("files.length --fetchRepositoryContent is ", files.length);

  return {
    ...repoData,
    files,
  };
}

async function fetchRepositoryContent(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  repositoryId: string
) {
  const files: GitHubFile[] = [];

  try {
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

        await sendProcessingUpdate(repositoryId, {
          status: "PROCESSING",
          message: `Fetching ${item.path} from Github`,
        });

        console.log("Fetched File: ", item.name);
        console.log("File Path: ", item.path);
      } else if (item.type === "dir") {
        const subFiles = await fetchRepositoryContent(
          owner,
          repo,
          branch,
          item.path,
          repositoryId
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
