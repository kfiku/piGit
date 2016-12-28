import { combineReducers } from 'redux';
import groups from './groups';
import app from './app';

const rootReducer = combineReducers({
  groups, app
});

export default rootReducer;
