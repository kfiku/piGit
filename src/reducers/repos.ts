import { ADD_REPO, RELOADING, UPDATE_REPO, DELETE_REPO, REORDER_REPO,
         ADD_GROUP, REORDER_GROUP,
         DELETE_GROUP, DELETE_GROUP_CONFIRM, DELETE_GROUP_CANCEL,
         START_EDITING_GROUP, EDIT_GROUP
       } from '../constants/ActionTypes';
import reorderArray from '../helpers/ReorderArray';
import clone from '../helpers/Clone';

const initialState = [
  {
    title: 'default',
    editing: false,
    confirmDelete: false;
    repos: []
  }
];

export default function repos(state = initialState, action) {
  let newState;
  switch (action.type) {
    case ADD_REPO:
      newState = clone(state);
      return newState.map((group, id) => {
        if (group.title === 'default') {
          group.repos.push(
            {
              id: group.repos.reduce((maxId, repo) => Math.max(repo.id, maxId), -1) + 1,
              dir: action.dir
            }
          );
        }
        return group;
      });

    case RELOADING:
      return state.map(group => {
        group.repos = group.repos.map((repo) => {
          if (repo.dir === action.dir) {
            repo.progressing = true;
          }
          return repo;
        });
        return group;
      });

    case UPDATE_REPO:
      return state.map(group => {
        group.repos = group.repos.map((repo) => {
          if (repo.dir === action.data.dir) {
            action.data.id = repo.id;
            repo = action.data;
            repo.progressing = false;
          }
          return repo;
        });
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

    case DELETE_REPO:
      return state.map(group => {
        group.repos = group.repos.filter((repo) => {
          return repo.dir !== action.dir;
        });
        return group;
      });

    case ADD_GROUP:
      newState = clone(state);

      newState.push({
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
        if (id === action.id) {
          group.confirmDelete = true;
        }

        return group;
      });

    case DELETE_GROUP_CANCEL:
      return state.map((group, id) => {
        if (id === action.id) {
          group.confirmDelete = false;
        }

        return group;
      });

    case DELETE_GROUP:
      return state.filter((group, id) => {
        return id !== action.id;
      });

    case START_EDITING_GROUP:
      return state.map((group, id) => {
        if (id === action.id) {
          group.editing = true;
        }

        return group;
      });

    case EDIT_GROUP:
      return state.map((group, id) => {
        if (id === action.id) {
          group.editing = false;
          group.title = action.title;
        }

        return group;
      });

    default:
      return state;
  }
}
