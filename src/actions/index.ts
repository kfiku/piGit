import { ADD_REPO, ADDING_REPO, ADDING_REPO_END,
         UPDATE,
         DELETE,
         REORDER_REPO,
         RELOADING, RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END,
         MESSAGE } from '../constants/ActionTypes';

import { resolve } from 'path';
import { ActionCreatorsMapObject } from 'redux';

import gitRepos from '../helpers/GitRepos';
import * as electron from 'electron';

const actions: ActionCreatorsMapObject = {
  addRepos: () => {
    return (dispatch, getState) => {
      let dirs = electron.remote.dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections']
      });

      dispatch({ type: ADDING_REPO });

      gitRepos.searchRepos(
        dirs,
        (gitDir) => { // steps
          const newRepoDit = resolve(gitDir, '..');
          const repoByDir = getState().repos.filter(s => s.dir === newRepoDit);
          if (repoByDir.length === 0) {
            dispatch(this.default.addRepo(newRepoDit));
          } else {
            dispatch(this.default.message(`Repo '${newRepoDit}' is already there ;-)`));
          }
        },
        (err, gitDirs) => {
          dispatch({ type: ADDING_REPO_END });
        });
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

  reorderRepo: (fromIndex, toIndex) => {
    return { type: REORDER_REPO, fromIndex, toIndex };
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
  },

  message: (msg) => {
    return { type: MESSAGE, msg };
  }
};

export default actions;
