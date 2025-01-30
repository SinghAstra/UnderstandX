import { GitHubContent } from "@/interfaces/github";
import { Octokit } from "@octokit/rest";
import { sendProcessingUpdate } from "../pusher/send-update";
import { prisma } from "./prisma";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

// This method :
// 1. Checks if repo Url is valid
// 2. Returns owner and repo
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
  const { data } = await octokit.repos.get({
    owner,
    repo,
  });

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

async function fetchGithubContent(
  owner: string,
  repo: string,
  path: string,
  repositoryId: string
) {
  const items: GitHubContent[] = [];

  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    for (const item of Array.isArray(contents) ? contents : [contents]) {
      if (item.type === "file" && isProcessableFile(item.name)) {
        const { data: fileData } = await octokit.repos.getContent({
          owner,
          repo,
          path: item.path,
        });

        if ("content" in fileData) {
          items.push({
            type: "file",
            name: item.name,
            path: item.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
          });
        }

        await sendProcessingUpdate(repositoryId, {
          status: "PROCESSING",
          message: `Fetching ${item.path}`,
        });

        console.log("Fetched File: ", item.name);
        console.log("File Path: ", item.path);
      } else if (item.type === "dir") {
        items.push({
          path: item.path,
          type: "dir",
          name: item.name,
        });

        const subItems = await fetchGithubContent(
          owner,
          repo,
          item.path,
          repositoryId
        );
        items.push(...subItems);
      }
    }
  } catch (error) {
    console.log(`Error fetching content for ${owner}/${repo}/${path}:`, error);
  }

  return items;
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

async function saveContentToDatabase(
  items: GitHubContent[],
  repositoryId: string
) {
  // Create a map to store directory records for quick lookup
  const directoryMap = new Map<string, any>();

  // Group items by type
  const directories = items.filter((i) => i.type === "dir");
  const files = items.filter((i) => i.type === "file");

  // First pass: Create all directory records
  for (const dir of directories) {
    const parentPath = dir.path.split("/").slice(0, -1).join("/");

    const directory = await prisma.directory.create({
      data: {
        path: dir.path,
        repositoryId,
        // If this isn't a top-level directory, set the parent
        parentId: parentPath ? directoryMap.get(parentPath)?.id : null,
      },
    });

    directoryMap.set(dir.path, directory);
  }

  // Second pass: Create all file records
  for (const file of files) {
    // Get directory path for this file (everything before the last slash)
    const pathParts = file.path.split("/");
    const fileName = pathParts.pop(); // Remove and get file name
    const dirPath = pathParts.join("/");

    // If dirPath is empty, this is a root-level file
    if (!dirPath) {
      await prisma.file.create({
        data: {
          path: file.path,
          name: file.name,
          content: file.content,
          repoId: repositoryId,
          // No directoryId for root-level files
        },
      });
    } else {
      // This is a file within a directory
      const directory = directoryMap.get(dirPath);

      if (!directory) {
        console.warn(`Directory not found for file: ${file.path}`);
        // Save as root-level file if directory not found
        await prisma.file.create({
          data: {
            path: file.path,
            name: file.name,
            content: file.content,
            repoId: repositoryId,
          },
        });
      } else {
        // Save file with directory reference
        await prisma.file.create({
          data: {
            path: file.path,
            name: file.name,
            content: file.content,
            repoId: repositoryId,
            directoryId: directory.id,
          },
        });
      }
    }
  }
}

export async function fetchAndSaveRepository(
  url: string,
  repositoryId: string
) {
  console.log("In fetchAndSaveRepository");
  const { owner, repo, isValid } = parseGithubUrl(url);

  if (!isValid || !owner) {
    throw new Error("Invalid GitHub URL");
  }

  console.log("owner is ", owner);
  console.log("repo is ", repo);
  console.log("isValid is ", isValid);

  // Fetch repository metadata
  const repoData = await fetchGitHubRepoMetaData(owner, repo);

  console.log("repoData is ", repoData);

  // Update repository status to PROCESSING
  await prisma.repository.update({
    where: { id: repositoryId },
    data: {
      status: "PROCESSING",
    },
  });

  // Process all content
  const items = await fetchGithubContent(owner, repo, "", repositoryId);

  console.log("items is ", items);

  // Save to database
  await saveContentToDatabase(items, repositoryId);
}
