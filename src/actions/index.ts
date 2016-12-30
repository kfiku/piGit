import { ADD_REPO, ADDING_REPO, ADDING_REPO_END,
         UPDATE_REPO,
         DELETE_REPO, DELETE_GROUP_CONFIRM, DELETE_GROUP_CANCEL,
         REORDER_REPO,
         RELOADING, RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END,
         ADD_GROUP, REORDER_GROUP, DELETE_GROUP, START_EDITING_GROUP, EDIT_GROUP,
         MESSAGE } from '../constants/ActionTypes';

import { resolve } from 'path';
import { ActionCreatorsMapObject } from 'redux';

import gitRepos from '../helpers/GitRepos';
import * as electron from 'electron';

const actions = {
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
          const repoByDir = getState().groups.filter(s => s.dir === newRepoDit);
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

      let i = 0;
      getState().groups.map((groups, gid) => {
        groups.repos.map((r, rid) => {
          // console.log(r, r.dir, id);
          setTimeout(() => {
            this.default.reloadRepo(r.dir)(dispatch);
          }, 100 * i);
          i++;
        });
      });

      setTimeout(() => {
        dispatch({ type: RELOADING_ALL_REPOS_END });
      }, 1000);
     };
  },

  addRepo: (dir) => {
    return { type: ADD_REPO, dir };
  },

  addGroup: () => {
    return { type: ADD_GROUP };
  },

  reorderRepo: (params) => {
    return { type: REORDER_REPO, params };
  },

  deleteRepo: (dir: string) => {
    return { type: DELETE_REPO, dir };
  },

  reloadRepo: (dir) => {
    return (dispatch) => {
      dispatch({ type: RELOADING, dir });
      gitRepos.refresh(dir, (err, data) => {
        dispatch({ type: UPDATE_REPO, data });
      });
    };
  },

  pullRepo: (dir) => {
    return (dispatch) => {
      dispatch({ type: RELOADING, dir });
      gitRepos.pull(dir, (err, data) => {
        dispatch({ type: UPDATE_REPO, data });
      });
    };
  },

  reorderGroup: (params) => {
    return { type: REORDER_GROUP, params };
  },

  confirmDeleteGroup: (id: number) => {
    return { type: DELETE_GROUP_CONFIRM, id };
  },

  cancelDeleteGroup: (id: number) => {
    return { type: DELETE_GROUP_CANCEL, id };
  },

  deleteGroup: (id: number) => {
    return { type: DELETE_GROUP, id };
  },

  startEditGroup: (id: number) => {
    return { type: START_EDITING_GROUP, id };
  },

  editGroup: (id: string, title) => {
    return { type: EDIT_GROUP, id, title };
  },

  message: (msg) => {
    return { type: MESSAGE, msg };
  }
};

export default actions;
