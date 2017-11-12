import { IGroup } from '../../interfaces/IGroup';
import { IRepo, IRepoStats } from '../../interfaces/IRepo';

import * as React from 'react';
import { basename } from 'path';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actionsToConnect from '../../actions';
import { renderLog } from '../../helpers/logger';
import Icon from '../helpers/Icon';
import Reload from '../Icons/Reload';
import Move from '../Icons/Move';
import X from '../Icons/X';
import ArrowDown from '../Icons/ArrowDown';
import ArrowUp from '../Icons/ArrowUp';
import Stats from './Stats';
import StyledRepo from './StyledRepo';

interface IRepoProps {
  repo: IRepo;
  group: IGroup;
  actions: any;
}

function getClassName(stats: IRepoStats) {
  if (stats) {
    if (stats.behind) {
      return 'behind';
    } else if (stats.ahead) {
      return 'ahead';
    } else if (stats.modified) {
      return 'modified';
    }
  }

  return '';
}

const RepoComponent: React.SFC<IRepoProps> = ({ repo, group, actions }) => {
  if (!repo || !repo.dir) { return null; }
  renderLog('REPO', repo.name || basename(repo.dir));

  return (
    <StyledRepo className={ 'repo ' + getClassName(repo.stats) } processing={repo.progressing}>
      <Icon className='icon icon-move repo-mover' title='Reorder this repo'>
        <Move />
      </Icon>

      <Icon className='icon icon-x' title='Delete this repo'
      onClick={ actions.deleteRepo.bind(null, repo.id, group.id) }>
        <X />
      </Icon>

      {!!repo.stats.behind && (
        <Icon className='icon icon-pull' title='Pull this repo'
          onClick={actions.pullRepo.bind(null, repo.id, repo.dir)}>
          <ArrowDown />
        </Icon>
      )}

      {!!repo.stats.ahead && !repo.stats.behind && (
        <Icon className='icon icon-push' title='push this repo'
        onClick={ actions.pushRepo.bind(null, repo.id, repo.dir) }>
          <ArrowUp />
        </Icon>
      )}

      <Icon spin={repo.progressing} className='icon icon-refresh ' title='Refresh this repo'
      onClick={ actions.reloadRepo.bind(null, repo.id, repo.dir) }>
        <Reload />
      </Icon>

      <div className='content'>
        <div className='title' title={repo.dir + ' '}
        onClick={ actions.showRepoDetails.bind(null, repo.id, repo.dir) }>
          { repo.name ? repo.name : basename(repo.dir) }
        </div>

        <div className='branch'>
          @{ repo.branch }
        </div>

        <Stats stats={repo.stats} />
      </div>
    </StyledRepo>
  );
};

const mapStateToProps = (state, ownProps) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  const repo = state.repos.filter(r => r.id === ownProps['repo-id'])[0];

  return { repo, group };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const Repo = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoComponent);

export default Repo;
