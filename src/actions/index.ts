import { ADD_REPO } from '../constants/ActionTypes'
import { ActionCreatorsMapObject } from 'redux'

const actions: ActionCreatorsMapObject = {
  addRepo: (dir: string) => {
    return { type: ADD_REPO, dir }
  }
}

export default actions;
// export const deleteRepo = id => ({ type: types.DELETE_REPO, id })
// export const editRepo = (id, text) => ({ type: types.EDIT_REPO, id, text })
// export const completeRepo = id => ({ type: types.COMPLETE_REPO, id })
// export const completeAll = () => ({ type: types.COMPLETE_ALL })
// export const clearCompleted = () => ({ type: types.CLEAR_COMPLETED })
