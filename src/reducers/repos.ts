import { ADD_REPO, RELOADING, UPDATE, DELETE } from '../constants/ActionTypes';

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

    default:
      return state;
  }
}
