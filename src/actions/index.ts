import { ADD_REPO, UPDATE, RELOADING, RELOAD_ALL } from '../constants/ActionTypes';
import { ActionCreatorsMapObject } from 'redux';

import gitRepos from '../helpers/Repos';

const actions: ActionCreatorsMapObject = {
  addRepo: (dir: string) => {
    return { type: ADD_REPO, dir };
  },

  reloadAll: () => {
    return { type: RELOAD_ALL };
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
