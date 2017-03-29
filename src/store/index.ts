const env = process.env.NODE_ENV || 'prod';

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer, { IRootReducer } from '../reducers';
import newId from '../helpers/newId';

const settings = require('electron-settings');

const createAppStore = (callback) => {
  let state: IRootReducer = settings.get('state');
  let composeEnhancers = compose;
  if (env === 'dev' && (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  };

  if (state) {
    if (state.repos && state.repos[0] && (<any>state.repos[0]).repos) {
      // OLD STRUCTURE
      let newState: any = { groups: [], repos: [], app: state.app };
      newState.groups = (<any>state).repos.map(group => ({
        id: newId(),
        title: group.title,
        editing: false,
        confirmDelete: false,
        progressing: false,
        repos: group.repos.map((repo => {
          repo.id = newId();
          newState.repos.push(repo);
          return repo.id;
        })),
      }));

      state = newState;
    }

    if (state.app) {
      state.app.addingRepos = false;
      state.app.reloadingAllRepos = false;
      state.app.message = '';
    }

    state.repos = state.repos.map(r => {
      r.progressing = false;
      return r;
    });

    state.groups = state.groups.map(g => {
      g.editing = false;
      g.confirmDelete = false;
      g.progressing = false;
      return g;
    });
  }

  let store = createStore(
    rootReducer,
    state,
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
      )
    )
  );

  let ti;
  store.subscribe(() => {
    clearTimeout(ti);
    ti = setTimeout(() => {
      settings.set('state', store.getState());
    }, 500);
  });

  callback(null, store);
};

export default createAppStore;
