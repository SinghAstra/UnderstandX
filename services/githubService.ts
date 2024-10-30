import { Octokit } from "@octokit/rest";

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

  async fetchFile(url: string) {
    const { owner, repo } = this.parseGitHubUrl(url);

    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path: "/package.json",
      });

      if ("content" in response.data && response.data.content) {
        const content = Buffer.from(response.data.content, "base64").toString(
          "utf-8"
        );
        console.log(content);
      } else {
        console.log("No content found for the specified path.");
      }
    } catch (err) {
      console.log("error --analyzeRepository is ", err);
      throw new Error("Failed to analyze repository");
    }
  }
}
