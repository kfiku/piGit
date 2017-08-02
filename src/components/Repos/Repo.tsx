import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import * as moment from 'moment';
import { basename } from 'path';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const Isvg = require('react-inlinesvg');

import actions from '../../actions';
import { renderLog } from '../../helpers/logger';
import Icon from '../helpers/Icon';
import StyledRepo from './StyledRepo';

const updateDate = (repo, el) => {
  setTimeout(() => {
    if (el && el.innerHTML) {
      el.innerHTML = moment(repo.lastUpdate).fromNow();
      updateDate(repo, el);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

const RepoComponent: any = ({repo, group, actions}: { repo: IRepo, group: IGroup, actions: any }) => {
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

      <Icon className='icon icon-x' title='Delete this repo'onClick={ actions.deleteRepo.bind(null, repo.id, group.id) }>
        <Isvg src='./svg/x.svg'/>
      </Icon>

      <Icon className='icon icon-pull' title='Pull this repo' onClick={ actions.pullRepo.bind(null, repo.id, repo.dir) }>
        <Isvg src='./svg/down-arrow.svg'/>
      </Icon>

      <Icon spin={repo.progressing} className='icon icon-refresh ' title='Refresh this repo' onClick={ actions.reloadRepo.bind(null, repo.id, repo.dir) }>
        <Isvg src='./svg/reload.svg'/>
      </Icon>

      <div className='content'>
        <div className='title' title={repo.dir + ' '} onClick={ actions.showRepoDetails.bind(null, repo.id, repo.dir) }>
          { repo.name ? repo.name : basename(repo.dir) }
        </div>

        <div className='branch'>
          @ { repo.branch }
        </div>

        <div className='status'>
          { repo.ahead ?
            <span className='ahead'>Ahead: { repo.ahead } </span> : ''
          }

          { repo.behind ?
            <span className='behind'>Behind: { repo.behind } </span> : ''
          }

          { (repo.modified && repo.modified.length) ?
            <span className='modified'>Modified: { repo.modified.length } </span> : ''
          }
        </div>

        <div className='updated' title='Updated from now' ref={ updateDate.bind(null, repo) }>
          { moment(repo.lastUpdate).fromNow() }
        </div>
      </div>
    </StyledRepo>
  );
};

RepoComponent.propTypes = {
  repo: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  const repo = state.repos.filter(r => r.id === ownProps['repo-id'])[0];

  return { repo, group };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const Repo = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoComponent);

export default Repo;
