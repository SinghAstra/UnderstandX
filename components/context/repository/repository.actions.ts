import { Repository } from "@prisma/client";
import { RepositoryAction } from "./repository.types";

// Action Creators
// These are used to create action objects
export const addActiveRepository = (
  repository: Repository
): RepositoryAction => ({
  type: "ADD_ACTIVE_REPOSITORY" as const,
  payload: repository,
});

export const removeActiveRepository = (
  repositoryId: string
): RepositoryAction => ({
  type: "REMOVE_ACTIVE_REPOSITORY" as const,
  payload: repositoryId,
});

export const addActiveRepositories = (
  repositories: Repository[]
): RepositoryAction => ({
  type: "ADD_ACTIVE_REPOSITORIES",
  payload: repositories,
});
