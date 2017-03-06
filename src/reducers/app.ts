import { ADD_REPO, ADDING_REPO, ADDING_REPO_END, SHOW_REPO, HIDE_REPO,
         RELOADING, UPDATE_REPO, DELETE_REPO, RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END,
         MESSAGE } from '../constants/ActionTypes';

import clone from '../helpers/Clone';

export interface IAppState {
  addingRepos: boolean;
  reloadingAllRepos: boolean;
  repoShown: string;
  message: string;
};

const initialState: IAppState = {
  addingRepos: false,
  reloadingAllRepos: false,
  repoShown: '',
  message: '',
};

export default function app(state = initialState, action) {
  let newState: IAppState;

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

    case SHOW_REPO:
      // console.log('SHOW_REPO', action.id);
      newState = clone(state);
      newState.repoShown = action.id;
      return newState;

    case HIDE_REPO:
      console.log('HIDE_REPO');
      newState = clone(state);
      newState.repoShown = '';
      return newState;

    case MESSAGE:
      newState = clone(state);
      newState.message = action.msg;
      return newState;

    default:
      return state;
  }
}
