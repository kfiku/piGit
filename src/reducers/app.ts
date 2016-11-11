import { ADD_REPO, ADDING_REPO, ADDING_REPO_END,
         RELOADING, UPDATE, DELETE, RELOAD_ALL } from '../constants/ActionTypes';

const initialState = {
  addingRepos: false
};

export default function app(state = initialState, action) {
  let newState;
  switch (action.type) {
    case ADDING_REPO:
      newState = JSON.parse(JSON.stringify(state));
      newState.addingRepos = true;
      return newState;

    case ADDING_REPO_END:
      newState = JSON.parse(JSON.stringify(state));
      newState.addingRepos = false;
      return newState;

    default:
      return state;
  }
}
