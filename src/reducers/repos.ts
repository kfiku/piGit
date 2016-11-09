import { ADD_REPO, RELOADING, UPDATE, DELETE, RELOAD_ALL } from '../constants/ActionTypes';

const initialState = [];

export default function repos(state = initialState, action) {
  switch (action.type) {
    case ADD_REPO:
      return [
        ...state,
        {
          id: state.reduce((maxId, repo) => Math.max(repo.id, maxId), -1) + 1,
          dir: action.dir
        }
      ];
    case RELOAD_ALL:
      return state.map((repo) => {
        return repo;
      });

    case RELOADING:
      return state.map((repo) => {
        if (repo.dir === action.dir) {
          repo.progressing = true;
        }
        return repo;
      });

    case UPDATE:
      return state.map((repo) => {
        if (repo.dir === action.data.dir) {
          action.data.id = repo.id;
          repo = action.data;
          repo.progressing = false;
        }
        return repo;
      });

    case DELETE:
      return state.filter((repo) => {
        return repo.dir !== action.dir;
      });
    // case DELETE_REPO:
    //   return state.filter(repo =>
    //     repo.id !== action.id
    //   )

    // case EDIT_REPO:
    //   return state.map(repo =>
    //     repo.id === action.id ?
    //       { ...repo, text: action.text } :
    //       repo
    //   )

    // case COMPLETE_REPO:
    //   return state.map(repo =>
    //     repo.id === action.id ?
    //       { ...repo, completed: !repo.completed } :
    //       repo
    //   )

    // case COMPLETE_ALL:
    //   const areAllMarked = state.every(repo => repo.completed)
    //   return state.map(repo => ({
    //     ...repo,
    //     completed: !areAllMarked
    //   }))

    // case CLEAR_COMPLETED:
    //   return state.filter(repo => repo.completed === false)

    default:
      return state;
  }
}
