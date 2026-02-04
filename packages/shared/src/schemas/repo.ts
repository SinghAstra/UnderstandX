import { RepositoryStatus } from "@understand-x/database";
import { z } from "zod";

export const importRepoSchema = z.object({
  repoUrl: z.url("Please provide a valid repository URL"),
});

export type ImportRepoInput = z.infer<typeof importRepoSchema>;

export interface LogResponse {
  id: string;
  message: string;
  status: RepositoryStatus;
  createdAt: string;
}

export const REDIS_CHANNELS = {
  REPO_LOG_PUBLISH: "REPOS:LOG_STREAM",
} as const;

export const SOCKET_EVENTS = {
  LOG_UPDATED: "log_updated",
};
