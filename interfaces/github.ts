import { Directory, File, Repository } from "@prisma/client";

export interface RepositoryPreview {
  owner: string;
  avatarUrl: string;
  name: string;
}

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

export interface RepositoryWithRelationsAndOverview extends Repository {
  directories: DirectoryWithRelations[];
  rootFiles: File[];
  files: File[];
}

export interface FileMetaData {
  id: string;
  name: string;
  path: string;
}
