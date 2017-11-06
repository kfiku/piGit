import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';

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
import Status from './Status';
import StyledRepo from './StyledRepo';

interface IRepoComponent {
  repo: IRepo;
  group: IGroup;
  actions: any;
}

class RepoComponent extends React.PureComponent<IRepoComponent> {
  render() {
    const {repo, group, actions} = this.props;
    if (!repo || !repo.dir) { return null; }

    renderLog('REPO', repo.name || basename(repo.dir));

    let cls = '';

    if (repo.behind) {
      cls = 'behind';
    } else if (repo.ahead) {
      cls = 'ahead';
    } else if (repo.modified && repo.modified.length) {
      cls = 'modified';
    }

    return (
      <StyledRepo className={ 'repo ' + cls } processing={repo.progressing}>
        <Icon className='icon icon-move repo-mover' title='Reorder this repo'>
          <Move />
        </Icon>

        <Icon className='icon icon-x' title='Delete this repo'
        onClick={ actions.deleteRepo.bind(null, repo.id, group.id) }>
          <X />
        </Icon>

        { cls === 'ahead' ?
          <Icon className='icon icon-push' title='push this repo'
          onClick={ actions.pushRepo.bind(null, repo.id, repo.dir) }>
            <ArrowUp />
          </Icon>
          :
          <Icon className='icon icon-pull' title='Pull this repo'
          onClick={ actions.pullRepo.bind(null, repo.id, repo.dir) }>
            <ArrowDown />
          </Icon>
        }

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

          <Status repo={repo} />
        </div>
      </StyledRepo>
    );
  }
}

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
