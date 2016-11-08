import { createStore, StoreEnhancer, Store, applyMiddleware } from 'redux';
import reducer from '../reducers';

const thunkMiddleware = require('redux-thunk').default;
const createLogger = require('redux-logger');

let store: Store<{}>;

const createAppStore = (callback) => {
  const electronSettings = require('electron-settings');

  electronSettings.get('state').then((state: StoreEnhancer<{}>) => {

    const loggerMiddleware = createLogger();

    store = createStore(
      reducer,
      state,
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
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
