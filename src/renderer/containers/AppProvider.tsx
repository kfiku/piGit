import { connect } from 'react-redux';
import { addRepos, addGroup, reloadAllRepos } from '../actions/reposActions';

const AppProvider =
  ({ render, ...rest }) => render({...rest});

const mapStateToProps = state => ({
  app: state.app
});

const mapDispatchToProps = {
  addRepos,
  addGroup,
  reloadAllRepos
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppProvider);
