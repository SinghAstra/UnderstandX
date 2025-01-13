import { Repository } from "@prisma/client";

export const addActiveRepository = (repository: Repository) => ({
  type: "ADD_ACTIVE_REPOSITORY" as const,
  payload: repository,
});
