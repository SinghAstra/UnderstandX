import { RepositoryAction, RepositoryState } from "./repository.types";

export const initialState: RepositoryState = {
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
        activeRepositories: [...state.activeRepositories, action.payload],
      };
    default:
      return state;
  }
}
