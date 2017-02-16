const env = process.env.NODE_ENV || 'prod';

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer, { IRootReducer } from '../reducers';
import newId from '../helpers/newId';

const electronSettings = require('electron-settings');

const createAppStore = (callback) => {
  electronSettings.get('state')
  .then((state: IRootReducer) => {
    let composeEnhancers = compose;
    if (env === 'dev' && (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    };

    if (state) {
      if (state.groups && ! (<any>state.groups).repos && state.groups[0].repos && (<any>state.groups[0].repos[0]).name) {
        // OLD STRUCTURE
        state.repos = [];
        (<any>state).groups = (<any>state).groups.map(group => {
          group.repos = group.repos.map(repo => {
            let nid = newId();

            repo.id = nid;
            state.repos.push(repo);

            return nid;
          });
          return group;
        });
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
        electronSettings.set('state', store.getState());
      }, 500);
    });

    callback(null, store);
  });
};

export default createAppStore;
