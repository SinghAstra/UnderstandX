import { RepositoryStatus } from "@prisma/client";

export const TERMINAL_STATUSES: RepositoryStatus[] = [
  "SUCCESS",
  "CANCELED",
  "FAILED",
];
