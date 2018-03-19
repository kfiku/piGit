import { connect } from 'react-redux';
import { close as closeAction } from '../actions/messagesActions';

const MessageProvider =
  ({ msg, close, render }) => render(msg, close);

const mapStateToProps = state => ({
  msg: state.app.message as string
});

const mapDispatchToProps = {
  close: closeAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageProvider);
