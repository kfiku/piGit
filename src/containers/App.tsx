import * as React from 'react';
import * as async from 'async';

import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

import { Nav } from '../components/Nav';
import { Repos } from '../components/Repos';

const reloadAll = () => {
  console.log('reload all');
};

const App: any = ({repos, actions}) => (
  <div>
    <Nav addRepo={actions.addRepo} reloadAll={reloadAll} />
    <Repos repos={repos} />
  </div>
);

App.propTypes = {
  repos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  repos: state.repos
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default connected

