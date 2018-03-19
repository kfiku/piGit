import * as React from 'react';
import { Helmet } from 'react-helmet';

import Groups from '../components/Groups/Groups';
import RepoDetails from '../components/Details';
import History from '../components/History/RepoHistory';
import Message from './Message';
import MessageProvider from '../containers/MessageProvider';
import Nav from './Nav';

const App = ({ appVersion }) => {
  return (
    <div>
      <Helmet>
        <title>PiGit - {appVersion}</title>
      </Helmet>

      <Nav/>
      /** NAV IS POS FIXED SO THIS IS NAV HEIGHT EMPTY DIV */
      <div className='nav-h'/>

      <Groups/>
      <MessageProvider render={({ msg, close }) =>
        <Message msg={msg} close={close} />
      } />
      <RepoDetails/>
      <History/>
    </div>
  );
};

export default App;
