import { ADD_REPO, ADDING_REPO, ADDING_REPO_END,
         UPDATE_REPO, SHOW_REPO, HIDE_REPO,
         DELETE_REPO, DELETE_GROUP_CONFIRM, DELETE_GROUP_CANCEL,
         REORDER_REPO,
         RELOADING, RELOADING_END, RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END,
         ADD_GROUP, REORDER_GROUP, DELETE_GROUP, START_EDITING_GROUP, EDIT_GROUP,
         RELOADING_GROUP, RELOADING_GROUP_END,
         MESSAGE } from '../constants/ActionTypes';

import * as electron from 'electron';
import gitRepos from '../helpers/GitRepos';
import newId from '../helpers/newId';

const getReposFromGroup = (state, groupId: string) =>
  state.groups
  .filter(g => g.id === groupId)
  .map(g => g.repos)
  .reduce((g, r) => g.concat(r))
  .map(repoId => state.repos.filter(r => r.id === repoId)[0])
  ;

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
          const repoByDir = getState().repos.filter(repo => repo.dir === gitDir);
          if (repoByDir.length === 0) {
            dispatch(actions.addRepo(gitDir));
          } else {
            dispatch(actions.message(`Repo '${gitDir}' is already there ;-)`));
          }
        },
        (err) => {
          console.log(err);
          dispatch({ type: ADDING_REPO_END });
        });
    };
  },

  reloadAllRepos: () => (dispatch, getState) => {
    dispatch({ type: RELOADING_ALL_REPOS });

    getState().repos.map((repo, i) => setTimeout(
      () => actions.reloadRepo(repo.id, repo.dir)(dispatch), 100 * i)
    );

    setTimeout(() => {
      dispatch({ type: RELOADING_ALL_REPOS_END });
    }, 1000);
  },

  updateAllReposStatus: () => (dispatch, getState) => {
    getState().repos.map((repo, i) => setTimeout(
      () => actions.updateRepoStatus(repo.id, repo.dir)(dispatch), 100 * i)
    );
  },

  addRepo: (dir: string) => (
    { type: ADD_REPO, dir, id: newId() }
  ),

  addGroup: () => (
    { type: ADD_GROUP }
  ),

  reorderRepo: params => (
    { type: REORDER_REPO, params }
  ),

  showRepoDetails: (id: string, dir: string) => dispatch => {
    dispatch({ type: SHOW_REPO, id });
    actions.reloadRepo(id, dir)(dispatch);
  },

  hideRepoDetails: () => (
    { type: HIDE_REPO }
  ),

  deleteRepo: (id: string, groupId: string) => (
    { type: DELETE_REPO, id, groupId }
  ),

  reloadRepo: (id: string, dir: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.refresh(dir, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  updateRepoStatus: (id: string, dir: string) => dispatch => {
    // dispatch({ type: RELOADING, id });
    gitRepos.updateStatus(dir, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  pullRepo: (id: string, dir: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.pull(dir, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

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

  commit: (id: string, dir: string, msg: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.commit(dir, msg, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  stashDrop: (id: string, dir: string, stashKey: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.stashDrop(dir, stashKey, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  stashApplyWithDrop: (id: string, dir: string, stashKey: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.stashApplyWithDrop(dir, stashKey, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  pushRepo: (id: string, dir: string) => dispatch => {
    dispatch({ type: RELOADING, id });
    gitRepos.push(dir, (err, data) => {
      if (err) {
        dispatch({ type: RELOADING_END, data, id });
        dispatch(actions.message(dir + ': ' + err.message || err + ''));
      } else {
        dispatch({ type: UPDATE_REPO, data, id });
      }
    });
  },

  reorderGroup: params => (
    { type: REORDER_GROUP, params }
  ),

  confirmDeleteGroup: (id: number) => (
    { type: DELETE_GROUP_CONFIRM, id }
  ),

  cancelDeleteGroup: (id: number) => (
    { type: DELETE_GROUP_CANCEL, id }
  ),

  deleteGroup: (id: number) => (
    { type: DELETE_GROUP, id }
  ),

  startEditGroup: (id: number) => (
    { type: START_EDITING_GROUP, id }
  ),

  editGroup: (id: string, title) => (
    { type: EDIT_GROUP, id, title }
  ),

  reloadGroup: (id: string) => (dispatch, getState) => {
    dispatch({ type: RELOADING_GROUP, id });

    getReposFromGroup(getState(), id)
    .map((r, i) => setTimeout(
      () => actions.reloadRepo(r.id, r.dir)(dispatch),
      100 * i
    ));

    setTimeout(() => {
      dispatch({ type: RELOADING_GROUP_END, id });
    }, 1000);
  },

  pullGroup: (id: string) => (dispatch, getState) => {
    dispatch({ type: RELOADING_GROUP, id });

    getReposFromGroup(getState(), id)
    .map((r, i) => setTimeout(
      () => actions.pullRepo(r.id, r.dir)(dispatch),
      100 * i
    ));

    setTimeout(() => {
      dispatch({ type: RELOADING_GROUP_END, id });
    }, 1000);
  },

  message: (msg) => (
    { type: MESSAGE, msg }
  )
};

export default actions;
