import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import * as debounce from 'lodash/debounce';

import { IGroup } from '../../interfaces/IGroup';
import { IRepo, IRepoStats } from '../../interfaces/IRepo';

import actionsToConnect from '../../actions';
import { renderLog } from '../../helpers/logger';
import StyledRepo from './StyledRepo';
import StyledRepoBg from './StyledRepoBg';
import Icons from './Icons';
import Content from './Content';

interface IRepoProps {
  repo: IRepo;
  group: IGroup;
  actions: any;
}
interface IRepoState {
  active: boolean;
}

class RepoComponent extends React.PureComponent<IRepoProps, IRepoState> {
  el: HTMLElement;

  constructor() {
    super();
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
    let parent = el.parentNode;
    for (let i = 0; i < 3; i++) {
      if (parent === box) {
        return true;
      }
      parent = parent.parentNode
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
    const { repo, group, actions } = this.props
    const { active } = this.state
    if (!repo || !repo.dir) { return null; }

    renderLog('REPO', repo.name);

    return (
      <StyledRepo
        innerRef={el => this.getRef(el)}
        className={ 'repo ' + this.getClassName(repo.stats) }
        processing={repo.progressing}
        active={active ? 1 : 0}
      >
        <Icons
          active={active}
          repo={repo}
          reloadRepo={actions.reloadRepo.bind(null, repo.id, group.id)}
          pullRepo={actions.pullRepo.bind(null, repo.id, repo.dir)}
          pushRepo={actions.pushRepo.bind(null, repo.id, repo.dir)}
          deleteRepo={actions.deleteRepo.bind(null, repo.id, repo.dir)}
        />

        <Content
          repo={repo}
          showRepoDetails={actions.showRepoDetails.bind(null, repo.id, repo.dir)}
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

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const Repo = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoComponent);

export default Repo;
