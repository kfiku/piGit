// import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import * as moment from 'moment';
import { basename } from 'path';
import { exec } from 'child_process';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const Isvg = require('react-inlinesvg');
import actionsToConnect from '../../actions';
import { renderLog } from '../../helpers/logger';
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import StyledRepoDetails from './StyledRepoDetails';

import Diff from './Diff';

const openInGitGui = (repo) => {
  exec(`cd ${ repo.dir } && git gui`);
};

const openInGitK = (repo) => {
  exec(`cd ${ repo.dir } && gitk`);
};

const updateDate = (repo, el) => {
  setTimeout(() => {
    if (el && el.innerHTML) {
      el.innerHTML = moment(repo.lastUpdate).fromNow();
      updateDate(repo, el);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

const RepoDetailsComponent: any = ({repo, actions}: { repo: IRepo, actions: any }) => {
  if (!repo) {
    renderLog('REPO DETAILS EMPTY');
    return <div></div>;
  }

  renderLog('REPO DETAILS', repo.name || basename(repo.dir));

  let cls = '';

  if (repo.behind) {
    cls = 'behind';
  } else if (repo.ahead) {
    cls = 'ahead';
  } else if (repo.modified && repo.modified.length) {
    cls = 'modified';
  }

  const modified = repo.modified && repo.modified.map(file => (
    <li key={ file }>
      { file }
    </li>
  ));

  const untracked = repo.untracked && repo.untracked.map(file => (
    <li key={ file }>
      { file }
    </li>
  ));

  return (
    <StyledRepoDetails className={ 'repo-details ' + cls }>
      <h2 className='header'>
        Details of repo: { repo.name ? repo.name : basename(repo.dir) } @ { repo.branch }
      </h2>

      <Icon className='icon icon-x' title='Delete this repo' onClick={ actions.hideRepoDetails.bind(null) }>
        <Isvg src='./svg/x.svg'/>
      </Icon>


      <div className='content'>
        <h4 className='status'>
          { repo.ahead ?
            <span className='ahead'>Ahead: { repo.ahead } </span> : ''
          }

          { repo.behind ?
            <span className='behind'>Behind: { repo.behind } </span> : ''
          }
        </h4>

        { repo.modified && repo.modified.length ?
          <div>
            <h4>Modified: { repo.modified.length }</h4>
            <ul>
              { modified }
            </ul>
          </div> : ''
        }

        { repo.untracked && repo.untracked.length ?
          <div>
            <h4>Untracked: { repo.untracked.length }</h4>
            <ul>
              { untracked }
            </ul>
          </div> : ''
        }

        <p className='updated' title='Updated from now' ref={ updateDate.bind(null, repo) }>
          Updated: { moment(repo.lastUpdate).fromNow() }
        </p>

        <Diff dir={ repo.dir }/>

      </div>

      <footer className='footer'>
        <Button onClick={ actions.reloadRepo.bind(null, repo.id, repo.dir) } className='button'>
          <Icon spin={repo.progressing} className='icon icon-refresh' title='Refresh this repo'>
            <Isvg src='./svg/reload.svg'/>
          </Icon>

          <span>Reload</span>
        </Button>

        <Button onClick={ actions.pullRepo.bind(null, repo.id, repo.dir) } className='button'>
          <Icon className='icon icon-pull' title='Pull this repo'>
            <Isvg src='./svg/down-arrow.svg'/>
          </Icon>

          <span>Pull</span>
        </Button>

        <Button onClick={ openInGitGui.bind(null, repo) } className='button'>
          <Icon className='icon icon-add'>
            <Isvg src='./svg/git-icon.svg'/>
          </Icon>

          <span>Open in git gui</span>
        </Button>

        <Button onClick={ openInGitK.bind(null, repo) } className='button'>
          <Icon className='icon icon-add'>
            <Isvg src='./svg/git-icon.svg'/>
          </Icon>

          <span>Open in gitk</span>
        </Button>
      </footer>

    </StyledRepoDetails>
  );
};

RepoDetailsComponent.propTypes = {
  actions: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps = {}) => {
  const repo = state.repos.filter(r => r.id === state.app.repoShown)[0];

  return { repo };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const RepoDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoDetailsComponent);

export default RepoDetails;
