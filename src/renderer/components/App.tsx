import * as React from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';

import Groups from '../components/Groups/Groups';
import RepoDetails from '../components/Details';
import History from '../components/History/RepoHistory';
import Message from './Message';
import MessageProvider from '../containers/MessageProvider';
import AppProvider from '../containers/AppProvider';
import Nav from './Nav';
import globalStyles from '../utils/globalStyles';

const GlobalStyles = createGlobalStyle`
  ${globalStyles}
`;

const App = ({ appVersion }) => {
  return (
    <div>
      <GlobalStyles />

      <Helmet>
        <title>PiGit - {appVersion}</title>
      </Helmet>

      <AppProvider render={({ app, addRepos, addGroup, reloadAllRepos }) =>
        <Nav
          app={app}
          addRepos={addRepos}
          addGroup={addGroup}
          reloadAllRepos={reloadAllRepos}
        />
      } />

      <div className='nav-h'/>

      <Groups />
      <RepoDetails/>
      <History/>
      <MessageProvider render={
        (msg, close) => <Message msg={msg} close={close} />}
      />
    </div>
  );
};

export default App;
