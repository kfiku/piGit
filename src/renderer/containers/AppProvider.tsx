import { connect } from 'react-redux';
import * as repos from '../actions/reposActions';

const AppProvider = ({ render, app, addRepos, addGroup, reloadAllRepos }) =>
    render({ app, addRepos, addGroup, reloadAllRepos });

const mapStateToProps = state => ({
  app: state.app
});

const mapDispatchToProps = {
  addRepos: repos.addRepos,
  addGroup: repos.addGroup,
  reloadAllRepos: repos.reloadAllRepos,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppProvider);
