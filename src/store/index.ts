const env = process.env.NODE_ENV || 'prod';

import { createStore, StoreEnhancer, Store, applyMiddleware, compose } from 'redux';
import reducer from '../reducers';
import newId from '../helpers/newId';

const thunkMiddleware = require('redux-thunk').default;
const createLogger = require('redux-logger');
const electronSettings = require('electron-settings');

const createAppStore = (callback) => {
  electronSettings.get('state').then((state: any) => {

    // console.log('loaded stater', state);

    const loggerMiddleware = createLogger();
    let composeEnhancers = compose;
    if (env === 'dev' && (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    };

    if (state && state.app) {
      state.app.addingRepos = false;
      state.app.reloadingAllRepos = false;
    }
    if (state && state.repos) {
      if (state.repos[0] && !state.repos[0].title) {
        state.repos = [{title: 'default', repos: state.repos}];
      } else {
        state.repos = state.repos.map(group => {
          if (!group.id) {
            group.id = newId();
          }
          group.editing = false;
          group.confirmDelete = false;
          return group;
        });
      }
    }

    let store = createStore(
      reducer,
      state,
      composeEnhancers(
        applyMiddleware(
          thunkMiddleware, // lets us dispatch() functions
          // loggerMiddleware // neat middleware that logs actions
        )
      )
    );

    let ti;
    store.subscribe(() => {
      clearTimeout(ti);
      ti = setTimeout(() => {
        electronSettings.set('state', store.getState());
      }, 500);
    });

    callback(null, store);
  });
};

export default createAppStore;
