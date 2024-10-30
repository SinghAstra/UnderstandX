import { Octokit } from "@octokit/rest";

interface FileNode {
  type: "file";
  name: string;
  path: string;
  content?: string;
  size: number;
}

interface DirectoryNode {
  type: "dir";
  name: string;
  path: string;
  children: RepositoryNode[];
}

type RepositoryNode = FileNode | DirectoryNode;

export class GitHubService {
  private octokit: Octokit;

  constructor(authToken?: string) {
    this.octokit = new Octokit({
      auth: authToken,
    });
  }

  private parseGitHubUrl(url: string): { owner: string; repo: string } {
    try {
      const urlObj = new URL(url);
      const [, owner, repo] = urlObj.pathname.split("/");
      if (!owner || !repo) {
        throw new Error("Invalid GitHub URL format");
      }
      return { owner, repo: repo.replace(".git", "") };
    } catch (error) {
      throw new Error(`Invalid GitHub URL: ${error}`);
    }
  }

  async fetchFilesByExtension(
    url: string,
    extension: string,
    path: string = ""
  ) {
    const { owner, repo } = this.parseGitHubUrl(url);
    const files: FileNode[] = [];

    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      const contents = Array.isArray(response.data)
        ? response.data
        : [response.data];

      for (const item of contents) {
        if (this.shouldSkipPath(item.name)) {
          continue;
        }

        if (item.type === "dir") {
          const subFiles = await this.fetchFilesByExtension(
            url,
            extension,
            item.path
          );
          files.push(...subFiles);
        } else if (item.type === "file" && item.name.endsWith(extension)) {
          const fileContent = await this.fetchFileContent(
            owner,
            repo,
            item.path
          );
          files.push({
            type: "file",
            name: item.name,
            path: item.path,
            content: fileContent,
            size: item.size,
          });
        }
      }

      return files;
    } catch (error) {
      console.log(
        `Error fetching files with extension ${extension} for path ${path}:`,
        error
      );
      throw new Error(`Failed to fetch files: ${(error as Error).message}`);
    }
  }

  async fetchRepositoryCode(url: string, path: string = "") {
    const { owner, repo } = this.parseGitHubUrl(url);
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      const contents = Array.isArray(response.data)
        ? response.data
        : [response.data];

      const structure: RepositoryNode[] = [];

      for (const item of contents) {
        if (this.shouldSkipPath(item.name)) {
          continue;
        }
        console.log("item.name is ", item.name);
        if (item.type === "dir") {
          const children = await this.fetchRepositoryCode(url, item.path);
          structure.push({
            type: "dir",
            name: item.name,
            path: item.path,
            children,
          });
        } else if (item.type === "file") {
          const fileContent = await this.fetchFileContent(
            owner,
            repo,
            item.path
          );
          structure.push({
            type: "file",
            name: item.name,
            path: item.path,
            content: fileContent,
            size: item.size,
          });
        }
      }

      return structure;
    } catch (error) {
      console.log(
        `Error fetching repository structure for path ${path}:`,
        error
      );
      throw new Error(
        `Failed to fetch repository structure: ${(error as Error).message}`
      );
    }
  }

  private async fetchFileContent(owner: string, repo: string, path: string) {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if ("content" in response.data && response.data.content) {
        return Buffer.from(response.data.content, "base64").toString();
      }

      return "Empty File.";
    } catch (error) {
      console.error(`Error fetching file content for ${path}:`, error);
      throw new Error(
        `Failed to fetch file content: ${(error as Error).message}`
      );
    }
  }

  private shouldSkipPath(name: string): boolean {
    const ignorePaths = [
      "node_modules",
      ".git",
      ".github",
      "dist",
      "build",
      ".next",
      ".env",
      "public",
      "assets",
    ];
    return ignorePaths.includes(name);
  }
}
