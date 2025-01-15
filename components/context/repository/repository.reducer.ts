import { RepositoryAction, RepositoryState } from "./repository.types";

export const initialState: RepositoryState = {
  userRepositories: [],
  activeRepositories: [],
  processingStatuses: {},
};

export function repositoryReducer(
  state: RepositoryState,
  action: RepositoryAction
): RepositoryState {
  switch (action.type) {
    case "ADD_USER_REPOSITORIES":
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
        processingStatuses: {
          [action.payload.id]: "PENDING",
          ...state.processingStatuses,
        },
      };
    case "REMOVE_ACTIVE_REPOSITORY":
      return {
        ...state,
        activeRepositories: state.activeRepositories.filter(
          (repo) => repo.id !== action.payload
        ),
      };
    case "ADD_ACTIVE_REPOSITORIES":
      const newStatuses = action.payload.reduce(
        (acc, repo) => ({
          ...acc,
          [repo.id]: "PENDING",
        }),
        {}
      );
      return {
        ...state,
        activeRepositories: [...action.payload],
        processingStatuses: {
          ...newStatuses,
        },
      };
    case "UPDATE_REPOSITORY_STATUS":
      return {
        ...state,
        processingStatuses: {
          ...state.processingStatuses,
          [action.payload.repoId]: action.payload.status,
        },
      };
    default:
      return state;
  }
}
