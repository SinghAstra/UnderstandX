export interface GitHubFile {
  name: string;
  path: string;
  content: string;
  type: string;
}

export interface GitHubRepoData {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  owner: {
    login: string;
  };
  html_url: string;
  private: boolean;
  default_branch: string;
  files: GitHubFile[];
  avatarUrl?: string;
}
