
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { injectGlobal } from 'styled-components';

import App from './components/App';
import createAppStore from './store';
import globalStyles from './utils/globalStyles';

const { app } = require('electron').remote;
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

injectGlobal`${globalStyles}`; // tslint:disable-line:no-unused-expression
