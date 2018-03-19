import { connect } from 'react-redux';
import { close } from '../actions/messagesActions';

const MessageProvider = ({ msg, close, render }) => render(msg, close)

const mapStateToProps = state => ({
  msg: state.app.message as string
});

const mapDispatchToProps = {
  close
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageProvider);
