
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { remote } from 'electron';

import App from './components/App';
import createAppStore from './store';

const { app } = remote;
const appVersion = app.getVersion();

console.log(
`appVersion: ${appVersion}
node: ${process.versions.node}
chrome: ${process.versions.chrome}
electron: ${process.versions.electron}
`);

createAppStore((err, store) => {
  if (err) {
    console.log(err);
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <App appVersion={appVersion}/>
      </Provider>,
      document.getElementById('root')
    );
  }
});
