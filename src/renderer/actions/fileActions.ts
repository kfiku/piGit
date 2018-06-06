import {
  RELOADING, RELOADING_END, UPDATE_REPO, SHOW_FILE
} from '../constants/ActionTypes';

import { IFile } from '../interfaces/IGit';
import gitRepos from '../helpers/GitRepos';
import actions from './index';

export const addFile = (id: string, dir: string, file: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.addFile(dir, file, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(actions.message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const unAddFile = (id: string, dir: string, file: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.unAddFile(dir, file, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(actions.message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const addAllFiles = (id: string, dir: string) => dispatch => {
  console.log('addAllFiles', id, dir);
  dispatch({ type: RELOADING, id });
  gitRepos.addAllFiles(dir, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(actions.message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};


export const unAddAllFiles = (id: string, dir: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.unAddAllFiles(dir, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(actions.message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const checkoutFile = (id: string, dir: string, file: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.checkoutFile(dir, file, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(actions.message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const deleteFile = (id: string, dir: string, file: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.deleteFile(dir, file, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(actions.message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const showFile = (file: IFile) => (
  { type: SHOW_FILE, file }
);
