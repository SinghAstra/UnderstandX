import { Repository } from "@prisma/client";

export interface RepositoryState {
  userRepositories: Repository[];
  activeRepositories: Repository[];
}

// RepositoryAction are used to define shape/structure of action object
// What is Action Object ?
// It is a plain object with a type property that indicates the type of action being performed.
// The payload property can hold any additional data required by the action.
export type RepositoryAction =
  | {
      type: "ADD_ACTIVE_REPOSITORY";
      payload: Repository;
    }
  | {
      type: "REMOVE_ACTIVE_REPOSITORY";
      payload: string;
    }
  | {
      type: "ADD_ACTIVE_REPOSITORIES";
      payload: Repository[];
    }
  | {
      type: "ADD_USER_REPOSITORIES";
      payload: Repository[];
    }
  | {
      type: "ADD_USER_REPOSITORY";
      payload: Repository;
    };
