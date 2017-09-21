import * as React from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actionsToConnect from '../actions';
import Dialog from './helpers/Dialog';

const MessageComponent: any = ({msg, actions}) => {
  if (msg !== '') {
    // if message is there
    return <Dialog msg={ msg } ok={ actions.message.bind(actions, '') } />;
  } else {
    // if message is empty
    return <div/>;
  }
};

MessageComponent.propTypes = {
  msg: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  msg: state.app.message
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const Message = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageComponent);

export default Message;
