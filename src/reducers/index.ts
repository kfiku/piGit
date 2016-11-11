import { combineReducers } from 'redux';
import repos from './repos';
import app from './app';

const rootReducer = combineReducers({
  repos, app
});

export default rootReducer;
