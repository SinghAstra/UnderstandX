import { RepositoryStatus } from "@prisma/client";

export interface StatusUpdate {
  id: string;
  status: RepositoryStatus;
  name: string;
  updatedAt: Date;
  error?: string;
}

export interface StatusManagerConfig {
  onStatusUpdate: (repoId: string, update: StatusUpdate) => void;
  // onError: (repoId: string, error: string) => void;
  onTerminalStatus: (repoId: string) => void;
}
