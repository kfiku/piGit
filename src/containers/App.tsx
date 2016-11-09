import * as React from 'react';
import * as async from 'async';

import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

import { Nav } from '../components/Nav';
import { Repos } from '../components/Repos';

const app: any = ({repos, actions}) => (
  <div>
    <Nav addRepo={actions.addRepo} reloadAll={actions.reloadAll} reload={actions.reload} repos={repos} />
    <Repos reload={actions.reload} delete={actions.delete} pull={actions.pull} repos={repos} />
  </div>
);

app.propTypes = {
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
)(app);

export default connected;

