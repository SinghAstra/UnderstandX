import { RepositoryWithRelations } from "@/app/repository/[...path]/page";
import { Repository } from "@prisma/client";
import { RepositoryAction } from "./repository.types";

export const setUserRepositories = (
  repositories: Repository[]
): RepositoryAction => ({
  type: "SET_USER_REPOSITORIES",
  payload: repositories,
});

export const addUserRepository = (
  repository: Repository
): RepositoryAction => ({
  type: "ADD_USER_REPOSITORY",
  payload: repository,
});

export const addRepositoryDetails = (
  repository: RepositoryWithRelations
): RepositoryAction => ({
  type: "ADD_REPOSITORY_DETAILS",
  payload: repository,
});
