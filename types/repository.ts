export type JobStatus =
  | "REPOSITORY_PROCESSING"
  | "CHUNK_GENERATION"
  | "EMBEDDING_GENERATION"
  | "COMPLETED"
  | "ERROR";

export type ProcessingStep = {
  id: string;
  title: string;
  description: string;
  jobStatus: JobStatus;
  completedAt?: string;
};

export interface Repository {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  description: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR";
  owner: string;
  url: string;
  startedAt: string;
  avatarUrl?: string;
}

export interface ProcessingStatus {
  currentStep: number;
  currentJob: JobStatus;
  error?: string;
  startTime: string;
  repoSize: number;
  repository: Repository;
}

// Constants for the processing steps
export const PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: "repo",
    title: "Repository Processing",
    description: "Fetching repository content and metadata",
    jobStatus: "REPOSITORY_PROCESSING",
  },
  {
    id: "chunks",
    title: "Content Chunking",
    description: "Breaking down content into semantic chunks",
    jobStatus: "CHUNK_GENERATION",
  },
  {
    id: "embeddings",
    title: "Embedding Generation",
    description: "Generating vector embeddings for search",
    jobStatus: "EMBEDDING_GENERATION",
  },
];

export const JOB_STEP_MAP: Record<JobStatus, number> = {
  REPOSITORY_PROCESSING: 0,
  CHUNK_GENERATION: 1,
  EMBEDDING_GENERATION: 2,
  COMPLETED: 3,
  ERROR: -1,
};
