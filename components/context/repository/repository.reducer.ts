import { RepositoryAction, RepositoryState } from "./repository.types";

export const initialState: RepositoryState = {
  userRepositories: [],
  repositoryDetails: {},
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
    case "ADD_REPOSITORY_DETAILS":
      console.log("action.payload is ", action.payload);
      return {
        ...state,
        repositoryDetails: {
          ...state.repositoryDetails,
          [action.payload.id]: action.payload,
        },
      };
    default:
      return state;
  }
}
