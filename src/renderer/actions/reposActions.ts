import {
  ADD_REPO, ADDING_REPO, ADDING_REPO_END, UPDATE_REPO, SHOW_REPO, HIDE_REPO,
  DELETE_REPO, REORDER_REPO, SHOW_FILE, RELOADING, RELOADING_END,
  PULLING, PULLING_END,
  RELOADING_ALL_REPOS, RELOADING_ALL_REPOS_END, ADD_GROUP
} from '../constants/ActionTypes';

import * as electron from 'electron';
import gitRepos from '../helpers/GitRepos';
import newId from '../helpers/newId';
import { IRepo } from '../interfaces/IRepo';
import { message } from './messagesActions';


export const addRepos = () => (dispatch, getState) => {
  let dirs = electron.remote.dialog.showOpenDialog({
    properties: ['openDirectory', 'multiSelections']
  });

  dispatch({ type: ADDING_REPO });

  gitRepos.searchRepos(
    dirs,
    (gitDir) => { // steps
      const repoByDir = getState().repos.filter(repo => repo.dir === gitDir);
      if (repoByDir.length > 0) {
        dispatch(message(`Repo '${gitDir}' is already there ;-)`));
        return;
      }

      gitRepos.getRepo(gitDir).then(repo => {
        dispatch(addRepo(repo.state));
      });
    },
    () => {
      dispatch({ type: ADDING_REPO_END });
    }
  );
};

export const reloadAllRepos = () => (dispatch, getState) => {
  dispatch({ type: RELOADING_ALL_REPOS });

  (getState().repos as IRepo[])
    .filter(repo => !repo.pulling)
    .map((repo, i) => setTimeout(
      () => reloadRepo(repo.id, repo.dir)(dispatch),
      100 * i
    ));

  setTimeout(() => {
    dispatch({ type: RELOADING_ALL_REPOS_END });
  }, 1000);
};

export const updateAllReposStatus = () => (dispatch, getState) => {
  (getState().repos as IRepo[])
    .filter(repo => !repo.pulling)
    .map((repo, i) => setTimeout(
      () => updateRepoStatus(repo.id, repo.dir)(dispatch),
      100 * i
    ));
};

export const addRepo = (repo: IRepo) => (
  { type: ADD_REPO, repo: {...repo, id: newId()} }
);

export const addGroup = () => (
  { type: ADD_GROUP }
);

export const reorderRepo = (params) => (
  { type: REORDER_REPO, params }
);

export const showRepoDetails = (repo: IRepo) => dispatch => {
  dispatch({ type: SHOW_REPO, id: repo.id });
  dispatch({ type: SHOW_FILE, file: repo.lists.unstaged[0] });
  reloadRepo(repo.id, repo.dir)(dispatch);
};

export const hideRepoDetails = () => (
  { type: HIDE_REPO }
);

export const deleteRepo = (id: string, groupId: string) => (
  { type: DELETE_REPO, id, groupId }
);

export const reloadRepo = (id: string, dir: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.refresh(dir, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const updateRepoStatus = (id: string, dir: string) => dispatch => {
  // dispatch({ type: RELOADING, id });
  gitRepos.updateStatus(dir, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const pullRepo = (id: string, dir: string) => dispatch => {
  dispatch({ type: PULLING, id });
  gitRepos.pull(dir, (err, data) => {
    if (err) {
      console.log('err', 2, err);
      dispatch({ type: PULLING_END, data, id });
      dispatch(message(dir + ': ' + err.message || err + ''));
    } else {
      console.log(2);
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const commit = (id: string, dir: string, msg: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.commit(dir, msg, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const stashDrop = (id: string, dir: string, stashKey: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.stashDrop(dir, stashKey, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const stashApplyWithDrop = (id: string, dir: string, stashKey: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.stashApplyWithDrop(dir, stashKey, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

export const pushRepo = (id: string, dir: string) => dispatch => {
  dispatch({ type: RELOADING, id });
  gitRepos.push(dir, (err, data) => {
    if (err) {
      dispatch({ type: RELOADING_END, data, id });
      dispatch(message(dir + ': ' + err.message || err + ''));
    } else {
      dispatch({ type: UPDATE_REPO, data, id });
    }
  });
};

// reorderGroup: params => (
//   { type: REORDER_GROUP, params }
// );

// export const confirmDeleteGroup = (id: number) => (
//   { type: DELETE_GROUP_CONFIRM, id }
// );

// export const cancelDeleteGroup = (id: number) => (
//   { type: DELETE_GROUP_CANCEL, id }
// );

// export const deleteGroup = (id: number) => (
//   { type: DELETE_GROUP, id }
// );

// export const startEditGroup = (id: number) => (
//   { type: START_EDITING_GROUP, id }
// );

// export const editGroup = (id: string, title) => (
//   { type: EDIT_GROUP, id, title }
// );

// export const reloadGroup = (id: string) => (dispatch, getState) => {
//   dispatch({ type: RELOADING_GROUP, id });

//   getReposFromGroup(getState(), id)
//   .map((r, i) => setTimeout(
//     () => reloadRepo(r.id, r.dir)(dispatch),
//     100 * i
//   ));

//   setTimeout(() => {
//     dispatch({ type: RELOADING_GROUP_END, id });
//   }, 1000);
// };

// export const pullGroup = (id: string) => (dispatch, getState) => {
//   dispatch({ type: RELOADING_GROUP, id });

//   getReposFromGroup(getState(), id)
//   .map((r, i) => setTimeout(
//     () => pullRepo(r.id, r.dir)(dispatch),
//     100 * i
//   ));

//   setTimeout(() => {
//     dispatch({ type: RELOADING_GROUP_END, id });
//   }, 1000);
// };




// export const addFile = (id: string, dir: string, file: string) => dispatch => {
//   dispatch({ type: RELOADING, id });
//   gitRepos.addFile(dir, file, (err, data) => {
//     if (err) {
//       dispatch({ type: RELOADING_END, data, id });
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
//       dispatch({ type: RELOADING_END, data, id });
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
//       dispatch({ type: RELOADING_END, data, id });
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
//       dispatch({ type: RELOADING_END, data, id });
//       dispatch(message(dir + ': ' + err.message || err + ''));
//     } else {
//       dispatch({ type: UPDATE_REPO, data, id });
//     }
//   });
// };

// export const showFile = (file: IFile) => (
//   { type: SHOW_FILE, file }
// );
