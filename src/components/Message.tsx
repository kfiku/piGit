import * as React from 'react';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

const MessageComponent: any = ({app, actions}) => {
  if (app.message !== '') {
    // if message is there
    return (
      <div className='modal is-active'>
        <div className='modal-background'></div>
        <div className='modal-card'>
          <section className='modal-card-body'>
            { app.message }
          </section>
          <footer className='modal-card-foot'>
            <a onClick={ actions.message.bind(actions, '') } className='button is-primary'>OK</a>
          </footer>
        </div>
      </div>
    );
  } else {
    // if message is empty
    return <div/>;
  }
};

MessageComponent.propTypes = {
  app: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  app: state.app
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const Message = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageComponent);

export default Message;
