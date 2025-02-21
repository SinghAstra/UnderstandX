import { RepositoryWithRelations } from "@/app/repository/[id]/page";
import { Repository } from "@prisma/client";

export interface RepositoryState {
  userRepositories: Repository[];
  repositoryDetails: {
    [id: string]: RepositoryWithRelations;
  };
}
export type RepositoryAction =
  | {
      type: "SET_USER_REPOSITORIES";
      payload: Repository[];
    }
  | {
      type: "ADD_USER_REPOSITORY";
      payload: Repository;
    };
