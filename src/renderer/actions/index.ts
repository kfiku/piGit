import {
  UPDATE_REPO,
  SHOW_FILE,
  RELOADING, RELOADING_END,
  MESSAGE
} from '../constants/ActionTypes';

import gitRepos from '../helpers/GitRepos';
import { IFile } from '../interfaces/IGit';

const actions = {
  addFile: (id: string, dir: string, file: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.addFile(dir, file, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  unAddFile: (id: string, dir: string, file: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.unAddFile(dir, file, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  checkoutFile: (id: string, dir: string, file: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.checkoutFile(dir, file, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  deleteFile: (id: string, dir: string, file: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.deleteFile(dir, file, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  showFile: (file: IFile) => (
    { type: SHOW_FILE, file }
  ),

  message: (msg: string) => (
    { type: MESSAGE, msg }
  )
};

export default actions;
