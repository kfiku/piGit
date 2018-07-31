import {
  ADDING_REPO, ADDING_REPO_END, SHOW_REPO, HIDE_REPO,
  RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END, SHOW_FILE,
  RELOADING_ALL_REPOS_STATUS, RELOADING_ALL_REPOS_STATUS_END,
  MESSAGE
} from '../constants/ActionTypes';

import clone from '../helpers/Clone';
import { IFile } from '../interfaces/IGit';

export interface IAppState {
  addingRepos: boolean;
  reloadingAllRepos: boolean;
  reloadingAllReposStatus: boolean;
  repoShown: string;
  fileShown: IFile;
  message: string;
}

const initialState: IAppState = {
  addingRepos: false,
  reloadingAllRepos: false,
  reloadingAllReposStatus: false,
  repoShown: '',
  fileShown: undefined,
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

    case RELOADING_ALL_REPOS_STATUS:
      newState = clone(state);
      newState.reloadingAllReposStatus = true;
      return newState;

    case RELOADING_ALL_REPOS_STATUS_END:
      newState = clone(state);
      newState.reloadingAllReposStatus = false;
      return newState;

    case SHOW_REPO:
      newState = clone(state);
      newState.repoShown = action.id;
      newState.fileShown = undefined;
      return newState;

    case HIDE_REPO:
      newState = clone(state);
      newState.repoShown = '';
      newState.fileShown = undefined;
      return newState;

    case SHOW_FILE:
      newState = clone(state);
      newState.fileShown = action.file;
      return newState;

    case MESSAGE:
      newState = clone(state);
      newState.message = action.msg;
      return newState;

    default:
      return state;
  }
}
