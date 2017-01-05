const env = process.env.NODE_ENV || 'prod';

import { IRepo } from '../interfaces/IRepo';

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from '../reducers';
import newId from '../helpers/newId';

const electronSettings = require('electron-settings');

const createAppStore = (callback) => {
  electronSettings.get('state').then((state: any) => {
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
        state.groups = state.repos.map(group => {
          if (!group.id) {
            group.id = newId();
          }
          group.editing = false;
          group.confirmDelete = false;
          return group;
        });

        delete state.repos;
      }
    }

    if (state && state.groups) {
      state.groups = state.groups.map(group => {
        if (!group.id) {
          group.id = newId();
        }

        group.repos = group.repos.map((repo: IRepo) => {
          repo.progressing = false;
          return repo;
        });


        group.editing = false;
        group.confirmDelete = false;
        return group;
      });
    }

    let store = createStore(
      reducer,
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
        electronSettings.set('state', store.getState());
      }, 500);
    });

    callback(null, store);
  });
};

export default createAppStore;
