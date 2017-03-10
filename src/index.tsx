console.log(
`node: ${process.versions.node}
chrome: ${process.versions.chrome}
electron: ${process.versions.electron}
`);

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, StoreEnhancer } from 'redux';
import { Provider } from 'react-redux';

import App from './containers/App';
import createAppStore from './store';

createAppStore((err, store) => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
});
