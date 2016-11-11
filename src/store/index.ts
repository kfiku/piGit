const env = process.env.NODE_ENV || 'prod';

import { createStore, StoreEnhancer, Store, applyMiddleware, compose } from 'redux';
import reducer from '../reducers';

const thunkMiddleware = require('redux-thunk').default;
const createLogger = require('redux-logger');
const electronSettings = require('electron-settings');

const createAppStore = (callback) => {
  electronSettings.get('state').then((state: StoreEnhancer<{}>) => {

    const loggerMiddleware = createLogger();
    let composeEnhancers = compose;
    if (env === 'dev' && (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    };

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