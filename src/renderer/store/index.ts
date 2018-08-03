const env = process.env.NODE_ENV || 'production';

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer, { IRootReducer } from '../reducers';
// import newId from '../helpers/newId';
import asyncActions from '../asyncActions';

const settings = require('electron-settings');

const createAppStore = (callback) => {
  let state: IRootReducer = settings.get('state');
  console.log(state);
  // state = undefined;

  if (state) {
    if (state.app) {
      state.app.addingRepos = false;
      state.app.reloadingAllRepos = false;
      state.app.message = '';
      // state.app.repoShown = '';
    }

    const reposIds = state.repos.map(r => r.id);
    state.groups = state.groups.map(g => {
      g.editing = false;
      g.confirmDelete = false;
      g.progressing = false;
      g.repos = g.repos.filter(r => reposIds.indexOf(r) > -1);
      return g;
    });

    const repoIdsInGroups = [].concat(
      ...state.groups.map(g => g.repos)
    );
    state.repos = state.repos.map(r => {
      r.progressing = false;
      r.pulling = false;
      return r;
    })
    .filter(r => !!r.dir)
    .filter(r => repoIdsInGroups.indexOf(r.id) > -1);

  }

  let composeEnhancers = compose;
  // if (env === 'development' && (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  //   composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  // }

  let store = createStore(
    rootReducer,
    state as any,
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
      )
    )
  );

  asyncActions(store);

  // Saving store to electron-setting on change
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
