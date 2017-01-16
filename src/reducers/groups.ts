import { IGroup } from '../interfaces/IGroup';
import { ADD_REPO, REORDER_REPO, DELETE_REPO,
         ADD_GROUP, REORDER_GROUP,
         DELETE_GROUP, DELETE_GROUP_CONFIRM, DELETE_GROUP_CANCEL,
         START_EDITING_GROUP, EDIT_GROUP
       } from '../constants/ActionTypes';
import reorderArray from '../helpers/ReorderArray';
import clone from '../helpers/Clone';
import newId from '../helpers/newId';

export const initialState: IGroup[] = [
  {
    id: newId(),
    title: 'default',
    editing: false,
    confirmDelete: false,
    repos: []
  }
];


export default function repos(state = initialState, action) {
  let newState;
  switch (action.type) {
    case ADD_REPO:
      return state.map((group, gid) => {
        if (gid === 0) {
          group = clone(group);
          group.repos.push(action.id);
        }
        return group;
      });

    case DELETE_REPO:
      return state.map((group, gid) => {
        if (group.id === action.groupId) {
          group = clone(group);
          group.repos = group.repos.filter(repo => repo !== action.id);
        }
        return group;
      });

    case ADD_GROUP:
      newState = clone(state);

      newState.push({
        id: newId(),
        title: 'New group',
        editing: true,
        repos: []
      });

      return newState;

    case REORDER_GROUP:
      newState = clone(state);
      newState = reorderArray(newState, action.params.oldIndex, action.params.newIndex);
      return newState;

    case DELETE_GROUP_CONFIRM:
      return state.map((group, id) => {
        if (group.id === action.id) {
          group = clone(group);
          group.confirmDelete = true;
        }

        return group;
      });

    case DELETE_GROUP_CANCEL:
      return state.map((group, id) => {
        if (group.id === action.id) {
          group = clone(group);
          group.confirmDelete = false;
        }

        return group;
      });

    case DELETE_GROUP:
      return state.filter((group, id) => {
        return group.id !== action.id;
      });

    case START_EDITING_GROUP:
      return state.map((group, id) => {
        if (group.id === action.id) {
          group = clone(group);
          group.editing = true;
        }

        return group;
      });

    case EDIT_GROUP:
      return state.map((group, id) => {
        if (group.id === action.id) {
          group = clone(group);
          group.editing = false;
          group.title = action.title;
        }

        return group;
      });

    case REORDER_REPO:
      newState = clone(state);
      let { from, to, oldIndex, newIndex } = action.params;
      if (from === to) {
        newState[from].repos = reorderArray(newState[from].repos, oldIndex, newIndex);
      } else {
        let valToMove = newState[from].repos[oldIndex];
        newState[from].repos.splice(oldIndex, 1);
        newState[to].repos.splice(newIndex, 0, valToMove);
      }

      return newState;

    default:
      return state;
  }
}
