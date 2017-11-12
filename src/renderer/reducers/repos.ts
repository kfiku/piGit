import { IRepo } from '../interfaces/IRepo';
import {
  ADD_REPO,
  RELOADING,
  RELOADING_END,
  UPDATE_REPO,
  DELETE_REPO
} from '../constants/ActionTypes';
import clone from '../helpers/Clone';
import equals from '../helpers/Equals';

export const initialState: IRepo[] = [];

export default function repos(state = initialState, action) {
  switch (action.type) {
    case ADD_REPO:
      state.push({
        id: action.id,
        dir: action.dir
      } as IRepo);
      return state;

    case RELOADING:
      return state.map(repo => {
        if (repo.id === action.id) {
          repo = clone(repo);
          repo.progressing = true;
        }

        return repo;
      });

    case RELOADING_END:
      return state.map(repo => {
        if (repo.id === action.id) {
          repo = clone(repo);
          repo.progressing = false;
        }

        return repo;
      });

    case UPDATE_REPO:
      return state.map(repo => {
        if (repo.id === action.id) {
          const newRepo = clone(action.data);
          newRepo.id = action.id;
          newRepo.progressing = false;
          if (!equals(repo, newRepo)) {
            repo = newRepo;
          }
        }

        return repo;
      });

    case DELETE_REPO:
      return state.filter((repo) => {
        return repo.id !== action.id;
      });

    default:
      return state;
  }
}
