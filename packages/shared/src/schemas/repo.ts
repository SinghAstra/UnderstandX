import { z } from "zod";

export const importRepoSchema = z.object({
  repoUrl: z.url("Please provide a valid repository URL"),
});

export type ImportRepoInput = z.infer<typeof importRepoSchema>;
