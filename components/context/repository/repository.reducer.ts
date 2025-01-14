import { RepositoryAction, RepositoryState } from "./repository.types";

export const initialState: RepositoryState = {
  repositories: [],
  activeRepositories: [],
};

export function repositoryReducer(
  state: RepositoryState,
  action: RepositoryAction
): RepositoryState {
  switch (action.type) {
    case "ADD_ACTIVE_REPOSITORY":
      return {
        ...state,
        activeRepositories: [action.payload, ...state.activeRepositories],
      };
    case "REMOVE_ACTIVE_REPOSITORY":
      return {
        ...state,
        activeRepositories: state.activeRepositories.filter(
          (repo) => repo.id !== action.payload
        ),
      };
    case "ADD_ACTIVE_REPOSITORIES":
      return {
        ...state,
        activeRepositories: [...action.payload, ...state.activeRepositories],
      };
    default:
      return state;
  }
}
