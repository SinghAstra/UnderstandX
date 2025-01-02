export interface GitHubFile {
  name: string;
  path: string;
  content: string;
  type: string;
}

export interface GitHubStats {
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
}
