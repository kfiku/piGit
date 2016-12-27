import * as React from 'react';
import * as async from 'async';

import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

import { Nav } from '../components/Nav';
import { Repos } from '../components/Repos';
import { Message } from '../components/Message';

const app: any = ({repos, actions}) => {
  return (
  <div>
    <Nav/>
    /** NAV IS POS FIXED SO THIS IS NAV HEIGHT EMPTY DIV */
    <div className='nav-h'/>

    <Repos reloadRepo={actions.reloadRepo}
           deleteRepo={actions.deleteRepo}
           pullRepo={actions.pullRepo}
           reorderRepo={actions.reorderRepo}

           reorderGroup={actions.reorderGroup}
           deleteGroup={actions.deleteGroup}
           confirmDeleteGroup={actions.confirmDeleteGroup}
           cancelDeleteGroup={actions.cancelDeleteGroup}
           startEditGroup={actions.startEditGroup}
           editGroup={actions.editGroup}
           repos={repos}/>
    <Message />
  </div>
  );
};

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

