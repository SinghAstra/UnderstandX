import { Directory, File, Repository } from "@prisma/client";

export interface GitHubContent {
  name: string;
  type: "file" | "dir";
  path: string;
  content?: string;
}

export interface DirectoryWithRelations extends Directory {
  children: DirectoryWithRelations[];
  files: File[];
}

export interface RepositoryWithRelations extends Repository {
  directories: DirectoryWithRelations[];
  files: File[];
}

export interface FileMetaData {
  id: string;
  name: string;
  path: string;
}
