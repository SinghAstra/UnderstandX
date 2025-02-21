import { Directory } from "@prisma/client";

export interface GitHubContent {
  name: string;
  type: "file" | "dir";
  path: string;
  content?: string;
}

export interface DirectoryWithRelations extends Directory {
  directories: DirectoryWithRelations[];
  files: File[];
}
