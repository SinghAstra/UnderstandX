import { Directory, File, Repository } from "@prisma/client";

export interface GitHubContent {
  name: string;
  type: "file" | "dir";
  path: string;
  content?: string;
}

export interface FileWithParsedAnalysis extends File {
  parsedAnalysis: React.ReactElement<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    string | React.JSXElementConstructor<any>
  > | null;
}

export interface DirectoryWithRelations extends Directory {
  children: DirectoryWithRelations[];
  files: FileWithParsedAnalysis[];
}

export interface RepositoryWithRelationsAndOverview
  extends RepositoryWithRelations {
  parsedOverview: React.ReactElement<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    string | React.JSXElementConstructor<any>
  > | null;
}

export interface RepositoryWithRelations extends Repository {
  directories: DirectoryWithRelations[];
  files: FileWithParsedAnalysis[];
}

export interface FileMetaData {
  id: string;
  name: string;
  path: string;
}
