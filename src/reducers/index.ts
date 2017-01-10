import { combineReducers } from 'redux';
import groups from './groups';
import repos from './repos';
import app from './app';

const rootReducer = combineReducers({
  groups, app, repos
});

export default rootReducer;
