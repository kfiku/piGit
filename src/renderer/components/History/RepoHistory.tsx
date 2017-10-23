import { IRepo } from '../../interfaces/IRepo';

import { connect } from 'react-redux';
const notifier = require('node-notifier');

import getIcon from '../../helpers/icon';
import isAppFocused from '../../helpers/isAppFocused';

interface IRepoHistoryComponent {
  repos: IRepo[];
}

let lastRepos = undefined;

function RepoHistoryComponent ({ repos }: IRepoHistoryComponent) {
  if (!lastRepos) {
    lastRepos = repos;
    return null;
  }

  const changes = repos
    .map((repo, i) =>
      repo.behind > lastRepos[i].behind ? repo : undefined)
    .filter(repo => repo);

  if (changes.length && !isAppFocused()) {
    const msg = changes
      .map(change => `${change.name} is ${change.behind} commits behind`)
      .join(', ');

    notifier.notify({
      title: 'PiGit',
      icon: getIcon(),
      contentImage: false,
      message: msg
    });
  }

  lastRepos = repos;

  return null;
}

const mapStateToProps = (state) => {
  const repos = state.repos;
  return { repos };
};

const Repo = connect(
  mapStateToProps
)(RepoHistoryComponent);

export default Repo;
