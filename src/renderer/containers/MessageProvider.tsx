import { connect } from 'react-redux';
import actions from '../actions';

interface IMessageProviderProps {
  msg: string;
  render: any;
  message: any;
}

function MessageProvider({ msg, message, render }: IMessageProviderProps) {
  return render({ msg, ok: () => message('') });
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
