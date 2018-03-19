import { connect } from 'react-redux';
import actions from '../actions';

interface IMessageProviderProps {
  msg: string;
  render: (msg: string, close: () => {}) => {};
  message: (msg: string) => {};
}

function MessageProvider({ msg, message, render }: IMessageProviderProps) {
  return render(msg, () => message(''));
};

const mapStateToProps = state => ({
  msg: state.app.message
});

const mapDispatchToProps = {
  message: actions.message
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageProvider);
