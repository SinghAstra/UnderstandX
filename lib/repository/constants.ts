import { RepositoryStatus } from "@prisma/client";

export const TERMINAL_STATUSES: RepositoryStatus[] = [
  "SUCCESS",
  "CANCELED",
  "FETCHING_GITHUB_REPO_FILES_FAILED",
  "CHUNKING_FILES_FAILED",
  "EMBEDDING_CHUNKS_FAILED",
];
