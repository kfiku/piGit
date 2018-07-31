import {
  DELETE_GROUP_CONFIRM, DELETE_GROUP_CANCEL,
  REORDER_GROUP, DELETE_GROUP, START_EDITING_GROUP, EDIT_GROUP,
  RELOADING_GROUP, RELOADING_GROUP_END
} from '../constants/ActionTypes';

import { IRepo } from '../interfaces/IRepo';
import { IRootReducer } from '../reducers/index';

import { pullRepoAsync, reloadRepoAsync } from './reposActions';

const getReposFromGroup = (state: IRootReducer, groupId: string): IRepo[] =>
  state.groups
    .filter(g => g.id === groupId)
    .map(g => g.repos)
    .reduce((g, r) => g.concat(r))
    .map(repoId => state.repos.find(r => r.id === repoId))
    .filter(repo => repo && !!repo.dir)
  ;

export const reorderGroup = params => (
  { type: REORDER_GROUP, params }
);

export const confirmDeleteGroup = (id: number) => (
  { type: DELETE_GROUP_CONFIRM, id }
);

export const cancelDeleteGroup = (id: number) => (
  { type: DELETE_GROUP_CANCEL, id }
);

export const deleteGroup = (id: number) => (
  { type: DELETE_GROUP, id }
);

export const startEditGroup = (id: number) => (
  { type: START_EDITING_GROUP, id }
);

export const editGroup = (id: string, title) => (
  { type: EDIT_GROUP, id, title }
);

export const reloadGroup = (id: string) => async (dispatch, getState) => {
  dispatch({ type: RELOADING_GROUP, id });
  const repos = getReposFromGroup(getState(), id);
  for (const repo of repos) {
    await reloadRepoAsync(repo.id, repo.dir)(dispatch);
  }
  dispatch({ type: RELOADING_GROUP_END, id });
};

export const pullGroup = (id: string) => async (dispatch, getState) => {
  dispatch({ type: RELOADING_GROUP, id });
  const repos = getReposFromGroup(getState(), id);
  for (const repo of repos) {
    await pullRepoAsync(repo.id, repo.dir)(dispatch);
  }
  dispatch({ type: RELOADING_GROUP_END, id });
};




// export const addFile = (id: string, dir: string, file: string) => dispatch => {
//   dispatch({ type: RELOADING, id });
//   gitRepos.addFile(dir, file, (err, data) => {
//     if (err) {
//       dispatch({ type: RELOADING_END, id });
//       dispatch(message(dir + ': ' + err.message || err + ''));
//     } else {
//       dispatch({ type: UPDATE_REPO, data, id });
//     }
//   });
// };

// export const unAddFile = (id: string, dir: string, file: string) => dispatch => {
//   dispatch({ type: RELOADING, id });
//   gitRepos.unAddFile(dir, file, (err, data) => {
//     if (err) {
//       dispatch({ type: RELOADING_END, id });
//       dispatch(message(dir + ': ' + err.message || err + ''));
//     } else {
//       dispatch({ type: UPDATE_REPO, data, id });
//     }
//   });
// };

// export const checkoutFile = (id: string, dir: string, file: string) => dispatch => {
//   dispatch({ type: RELOADING, id });
//   gitRepos.checkoutFile(dir, file, (err, data) => {
//     if (err) {
//       dispatch({ type: RELOADING_END, id });
//       dispatch(message(dir + ': ' + err.message || err + ''));
//     } else {
//       dispatch({ type: UPDATE_REPO, data, id });
//     }
//   });
// };

// export const deleteFile = (id: string, dir: string, file: string) => dispatch => {
//   dispatch({ type: RELOADING, id });
//   gitRepos.deleteFile(dir, file, (err, data) => {
//     if (err) {
//       dispatch({ type: RELOADING_END, id });
//       dispatch(message(dir + ': ' + err.message || err + ''));
//     } else {
//       dispatch({ type: UPDATE_REPO, data, id });
//     }
//   });
// };

// export const showFile = (file: IFile) => (
//   { type: SHOW_FILE, file }
// );
