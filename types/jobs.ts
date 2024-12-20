import { GitHubRepoData } from "./github";
import { JobStatus } from "./repository";

export interface JobMetadata {
  repositoryId: string;
  userId: string;
  githubUrl: string;
  isPrivate: boolean;
  repoData: GitHubRepoData;
}

export interface ProcessingStatus {
  currentJob: JobStatus;
  startTime: string;
  repoSize?: number;
  error?: string;
  repository: {
    id: string;
    githubId: number;
    name: string;
    fullName: string;
    description?: string;
    status: "PENDING" | "SUCCESS";
    owner: string;
    url: string;
    startedAt: string;
    avatarUrl?: string;
  };
}
