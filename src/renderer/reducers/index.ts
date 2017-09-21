import { IRepo } from '../interfaces/IRepo';
import { IGroup } from '../interfaces/IGroup';

import { combineReducers } from 'redux';
import groups from './groups';
import repos from './repos';
import app, { IAppState } from './app';

export interface IRootReducer {
  app: IAppState;
  groups: IGroup[];
  repos: IRepo[];
}

const rootReducer = combineReducers({
  groups, app, repos
});

export default rootReducer;
