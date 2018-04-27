import * as React from 'react';
import { connect } from 'react-redux';
// import * as debounce from 'lodash/debounce';

import { IGroup } from '../../interfaces/IGroup';
import { IRepo, IRepoStats } from '../../interfaces/IRepo';

// import actionsToConnect from '../../reposActions';
import {
  reloadRepo, pullRepo, pushRepo, deleteRepo, showRepoDetails
} from '../../actions/reposActions';
// import { renderLog } from '../../helpers/logger';
import StyledRepo from './StyledRepo';
import StyledRepoBg from './StyledRepoBg';
import Icons from './Icons';
import Content from './Content';

interface IRepoProps {
  repo: IRepo;
  group: IGroup;
  dispatchReloadRepo: Function;
  dispatchPullRepo: Function;
  dispatchPushRepo: Function;
  dispatchDeleteRepo: Function;
  dispatchShowRepoDetails: Function;
}
interface IRepoState {
  active: boolean;
}

class RepoComponent extends React.PureComponent<IRepoProps, IRepoState> {
  el: HTMLElement;

  constructor(p, c) {
    super(p, c);
    this.state = { active: undefined };
  }
  getClassName(stats: IRepoStats) {
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

  diamondOver() {
    this.setState({ active: true });
  }

  isElInside(el: HTMLElement, box: HTMLElement) {
    if (el && el.parentNode) {
      let parent = el.parentNode;
      for (let i = 0; i < 3; i++) {
        if (parent === box) {
          return true;
        }
        parent = parent.parentNode;
      }
    }
    return false;
  }

  diamondOut(e) {
    if (!this.isElInside(e.toElement || e.relatedTarget, this.el)) {
      this.setState({ active: undefined });
    }
  }

  getRef(el) {
    this.el = el;
  }

  render() {
    const {
      repo, group,
      dispatchReloadRepo,
      dispatchPullRepo,
      dispatchPushRepo,
      dispatchDeleteRepo,
      dispatchShowRepoDetails,
    } = this.props;
    const { active } = this.state;
    if (!repo || !repo.dir || !repo.stats) { return null; }

    // renderLog('REPO', repo.name);

    return (
      <StyledRepo
        innerRef={el => this.getRef(el)}
        className={ 'repo ' + this.getClassName(repo.stats) }
        processing={repo.progressing}
        active={active ? 1 : 0}
        onMouseLeave={(e) => this.diamondOut(e)}
        onMouseEnter={() => this.diamondOver()}
      >
        <Icons
          active={active || repo.progressing || repo.pulling}
          repo={repo}
          reloadRepo={() => dispatchReloadRepo(repo.id, repo.dir)}
          pullRepo={() => dispatchPullRepo(repo.id, repo.dir)}
          pushRepo={() => dispatchPushRepo(repo.id, repo.dir)}
          deleteRepo={() => dispatchDeleteRepo(repo.id, group.id)}
        />

        <Content
          repo={repo}
          showRepoDetails={() => dispatchShowRepoDetails(repo)}
        />

        <StyledRepoBg
          className={this.getClassName(repo.stats)}
          diamondOver={() => this.diamondOver()}
          diamondOut={(e) => this.diamondOut(e)}
          active={active ? 1 : 0}
        />
      </StyledRepo>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  const repo = state.repos.filter(r => r.id === ownProps['repo-id'])[0];

  return { repo, group };
};

const mapDispatchToProps = {
  dispatchReloadRepo: reloadRepo,
  dispatchPullRepo: pullRepo,
  dispatchPushRepo: pushRepo,
  dispatchDeleteRepo: deleteRepo,
  dispatchShowRepoDetails: showRepoDetails
};

const Repo = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoComponent);

export default Repo;
