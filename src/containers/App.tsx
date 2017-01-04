import * as React from 'react';
import * as async from 'async';

import Nav from '../components/Nav';
import Groups from '../components/Groups';
import Message from '../components/Message';

const App = () => {
  return (
    <div>
      <Nav/>

      /** NAV IS POS FIXED SO THIS IS NAV HEIGHT EMPTY DIV */
      <div className='nav-h'/>

      <Groups/>

      <Message/>
    </div>
  );
};

export default App;

