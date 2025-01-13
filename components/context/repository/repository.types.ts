import { Repository } from "@prisma/client";

export interface RepositoryState {
  activeRepositories: Repository[];
}

export type RepositoryAction = {
  type: "ADD_ACTIVE_REPOSITORY";
  payload: Repository;
};
