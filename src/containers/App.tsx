import * as React from 'react';
import * as async from 'async';

import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

import Nav from '../components/Nav';
import Groups from '../components/Groups';
import Message from '../components/Message';

const App: any = () => {
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

