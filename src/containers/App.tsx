import * as React from 'react';
import { injectGlobal } from 'styled-components';

import Nav from '../components/Nav';
import Groups from '../components/Groups/Groups';
import RepoDetails from '../components/Details';
import Message from '../components/Message';

import globalStyles from '../utils/globalStyles';

const App = () => {
  return (
    <div>
      <Nav/>

      /** NAV IS POS FIXED SO THIS IS NAV HEIGHT EMPTY DIV */
      <div className='nav-h'/>

      <Groups/>

      <Message/>

      <RepoDetails/>
    </div>
  );
};

export default App;

injectGlobal`${globalStyles}`; // tslint:disable-line:no-unused-expression
