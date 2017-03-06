import * as React from 'react';
import * as async from 'async';

import Nav from '../components/Nav';
import Groups from '../components/Groups';
import RepoDetails from '../components/Repos/RepoDetails';
import Message from '../components/Message';

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

