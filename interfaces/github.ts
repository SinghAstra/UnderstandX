import { Directory, File, Repository } from "@prisma/client";
import { JSXElementConstructor, ReactElement } from "react";

export interface GitHubContent {
  name: string;
  type: "file" | "dir";
  path: string;
  content?: string;
}

export interface FileWithParsedAnalysis extends File {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedAnalysis: ReactElement<any, string | JSXElementConstructor<any>> | null;
}

export interface DirectoryWithRelations extends Directory {
  children: DirectoryWithRelations[];
  files: FileWithParsedAnalysis[];
}

export interface RepositoryWithRelationsAndOverview extends Repository {
  directories: DirectoryWithRelations[];
  files: FileWithParsedAnalysis[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedOverview: ReactElement<any, string | JSXElementConstructor<any>> | null;
}

export interface FileMetaData {
  id: string;
  name: string;
  path: string;
}
