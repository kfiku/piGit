import { ADD_REPO, ADDING_REPO, ADDING_REPO_END,
         RELOADING, UPDATE_REPO, DELETE_REPO, RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END,
         MESSAGE } from '../constants/ActionTypes';

import clone from '../helpers/Clone';

const initialState = {
  addingRepos: false,
  reloadingAllRepos: false,
  message: '',
};

export default function app(state = initialState, action) {
  let newState;
  switch (action.type) {
    case ADDING_REPO:
      newState = clone(state);
      newState.addingRepos = true;
      return newState;

    case ADDING_REPO_END:
      newState = clone(state);
      newState.addingRepos = false;
      return newState;

    case RELOADING_ALL_REPOS:
      newState = clone(state);
      newState.reloadingAllRepos = true;
      return newState;

    case RELOADING_ALL_REPOS_END:
      newState = clone(state);
      newState.reloadingAllRepos = false;
      return newState;

    case MESSAGE:
      newState = clone(state);
      newState.message = action.msg;
      return newState;

    default:
      return state;
  }
}
