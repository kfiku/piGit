import { ADD_REPO, ADDING_REPO, ADDING_REPO_END,
         UPDATE,
         DELETE,
         RELOADING, RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END } from '../constants/ActionTypes';
import { resolve } from 'path';
import { ActionCreatorsMapObject } from 'redux';

import gitRepos from '../helpers/GitRepos';
import * as electron from 'electron';

const actions: ActionCreatorsMapObject = {
  addRepos: () => {
    return (dispatch) => {
      let dirs = electron.remote.dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections']
      });

      dispatch({ type: ADDING_REPO });

      gitRepos.searchRepos(
        dirs,
        (gitDir) => {
          console.log(this.default.addRepo);
          dispatch(this.default.addRepo(resolve(gitDir, '..')));
        },
        (err, gitDirs) => {
          dispatch({ type: ADDING_REPO_END });
          console.log(err, dirs);
        });
      // return { type: ADD_REPO, dirs };
    };
  },

  reloadAllRepos: () => {
     return (dispatch, getState) => {
      dispatch({ type: RELOADING_ALL_REPOS });

      getState().repos.map((r, id) => {
        // console.log(r, r.dir, id);
        setTimeout(() => {
          this.default.reload(r.dir)(dispatch);
        }, 50 * id);
      });

      setTimeout(() => {
        dispatch({ type: RELOADING_ALL_REPOS_END });
      }, 1000);
     };
  },

  addRepo: (dir) => {
    return { type: ADD_REPO, dir };
  },

  delete: (dir: string) => {
    return { type: DELETE, dir };
  },

  reload: (dir) => {
    return (dispatch) => {
      dispatch({ type: RELOADING, dir });
      gitRepos.fetch(dir, (err, data) => {
        dispatch({ type: UPDATE, data });
      });
    };
  },

  pull: (dir) => {
    return (dispatch) => {
      dispatch({ type: RELOADING, dir });
      gitRepos.pull(dir, (err, data) => {
        dispatch({ type: UPDATE, data });
      });
    };
  }
};

export default actions;
// export const deleteRepo = id => ({ type: types.DELETE_REPO, id })
// export const editRepo = (id, text) => ({ type: types.EDIT_REPO, id, text })
// export const completeRepo = id => ({ type: types.COMPLETE_REPO, id })
// export const completeAll = () => ({ type: types.COMPLETE_ALL })
// export const clearCompleted = () => ({ type: types.CLEAR_COMPLETED })
