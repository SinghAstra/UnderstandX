import { RepositoryAction, RepositoryState } from "./repository.types";

export const initialState: RepositoryState = {
  userRepositories: [],
  activeRepositories: [],
};

export function repositoryReducer(
  state: RepositoryState,
  action: RepositoryAction
): RepositoryState {
  switch (action.type) {
    case "SET_USER_REPOSITORIES":
      return {
        ...state,
        userRepositories: [...action.payload],
      };
    case "ADD_USER_REPOSITORY":
      return {
        ...state,
        userRepositories: [action.payload, ...state.userRepositories],
      };
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
    case "UPDATE_REPOSITORY_STATUS":
      return {
        ...state,
        userRepositories: state.userRepositories.map((repo) =>
          repo.id === action.payload.id
            ? { ...repo, status: action.payload.status }
            : repo
        ),
        activeRepositories: state.activeRepositories.map((repo) =>
          repo.id === action.payload.id
            ? { ...repo, status: action.payload.status }
            : repo
        ),
      };
    default:
      return state;
  }
}
