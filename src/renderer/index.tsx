const { app } = require('electron').remote;
const appVersion = app.getVersion();
console.log(
`appVersion: ${appVersion}
node: ${process.versions.node}
chrome: ${process.versions.chrome}
electron: ${process.versions.electron}
`);

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './containers/App';
import createAppStore from './store';

createAppStore((err, store) => {
  if (err) {
    console.log(err);
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  }
});
