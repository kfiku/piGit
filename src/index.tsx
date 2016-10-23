import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, StoreEnhancer } from 'redux';
import { Provider } from 'react-redux';

import App from './containers/App';
import reducer from './reducers'

const electronSettings = require('electron-settings');
electronSettings.get('state').then((state: StoreEnhancer<{}>) => {
  
  const store = createStore(reducer, state);

  store.subscribe(() => {
    electronSettings.set('state', store.getState());
  });

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('example')
  );
  });
