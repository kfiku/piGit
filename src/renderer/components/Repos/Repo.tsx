import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import * as moment from 'moment';
import { basename } from 'path';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const Isvg = require('react-inlinesvg');

import actionsToConnect from '../../actions';
import { renderLog } from '../../helpers/logger';
import Icon from '../helpers/Icon';
import Status from './Status';
import StyledRepo from './StyledRepo';

const updateDate = (repo, el) => {
  setTimeout(() => {
    if (el && el.innerHTML) {
      el.innerHTML = moment(repo.lastUpdate).fromNow();
      updateDate(repo, el);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

interface IRepoComponent {
  repo: IRepo;
  group: IGroup;
  actions: any;
}

class RepoComponent extends React.PureComponent<IRepoComponent> {
  public to1;
  public to2;

  constructor() {
    super();
  }

  componentWillUnmount() {
    clearTimeout(this.to1);
    clearTimeout(this.to2);
  }

  componentWillMount() {
    this.fetchTimeout();
    // this.updateTimeout();
  }

  fetchTimeout() {
    if (this.props.repo && !this.props.repo.progressing) {
      clearTimeout(this.to1);
      const { id, dir } = this.props.repo;

      this.to1 = setTimeout(() => {
        this.props.actions.reloadRepo(id, dir);
        this.fetchTimeout();
      }, 5 * 60 * 1000); // 5 minutes
    } else {
      this.to1 = setTimeout(
        () => this.fetchTimeout(),
        10 * 1000 // 5 sec
      );
    }
  }

  updateTimeout() {
    if (this.props.repo && !this.props.repo.progressing) {
      clearTimeout(this.to2);
      const { id, dir } = this.props.repo;

      this.to2 = setTimeout(() => {
        this.props.actions.updateRepoStatus(id, dir);
        this.updateTimeout();
      }, 10 * 1000); // 10 sec
    } else {
      this.to2 = setTimeout(
        () => this.updateTimeout(),
        10 * 1000 // 10 sec
      );
    }
  }

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
          <Isvg src='./svg/move.svg' />
        </Icon>

        <Icon className='icon icon-x' title='Delete this repo'
        onClick={ actions.deleteRepo.bind(null, repo.id, group.id) }>
          <Isvg src='./svg/x.svg'/>
        </Icon>

        { cls === 'ahead' ?
          <Icon className='icon icon-push' title='push this repo'
          onClick={ actions.pushRepo.bind(null, repo.id, repo.dir) }>
            <Isvg src='./svg/down-arrow.svg'/>
          </Icon>
          :
          <Icon className='icon icon-pull' title='Pull this repo'
          onClick={ actions.pullRepo.bind(null, repo.id, repo.dir) }>
            <Isvg src='./svg/down-arrow.svg'/>
          </Icon>
        }

        <Icon spin={repo.progressing} className='icon icon-refresh ' title='Refresh this repo'
        onClick={ actions.reloadRepo.bind(null, repo.id, repo.dir) }>
          <Isvg src='./svg/reload.svg'/>
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

          {/* <div className='updated' title='Updated from now' ref={ updateDate.bind(null, repo) }>
            { moment(repo.lastUpdate).fromNow() }
          </div> */}
        </div>
      </StyledRepo>
    );
  }
}

// function RepoComponent (: IRepoComponent) {

// }

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
