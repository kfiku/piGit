import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import * as moment from 'moment';
import { basename } from 'path';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../../actions';
import { renderLog } from '../../helpers/logger';

const Isvg = require('react-inlinesvg');

// import { Repo } from './Repo';
// import Sortable = require('sortablejs');

// const onUpdateGroup = (actions, event) => {
//   actions.reorderGroup({
//     oldIndex: event.oldIndex,
//     newIndex: event.newIndex
//   });
// };

// const sortableGroups = (actions, el) => {
//   if (el) {
//     let options = {
//       animation: 150,
//       handle: '.icon-move',
//       draggable: '.group',
//       forceFallback: true,
//       onUpdate: onUpdateGroup.bind(null, actions),
//     };

//     Sortable.create(el, options);
//   }
// };

const RepoComponent: any = ({repo, group, actions}: { repo: IRepo, group: IGroup, actions: any }) => {
  renderLog('REPO', repo.dir);
  let cls = '';

  if (repo.behind) {
    cls = 'behind';
  } else if (repo.ahead) {
    cls = 'ahead';
  } else if (repo.modified && repo.modified.length) {
    cls = 'modified';
  }

  return (
    <div className={ 'repo ' + cls + (repo.progressing ? ' progressing' : '')  }>
      <i className='icon icon-move' title='Reorder this repo'>
        <Isvg src='./svg/move.svg' />
      </i>

      <i className='icon icon-x' title='Delete this repo'
      onClick={ actions.deleteRepo.bind(null, repo.dir) }
      >
        <Isvg src='./svg/x.svg'/>
      </i>

      <i className='icon icon-pull' title='Pull this repo'
      onClick={ actions.pullRepo.bind(null, repo.dir) }
      >
        <Isvg src='./svg/down-arrow.svg'/>
      </i>

      <i className='icon icon-refresh' title='Refresh this repo'
      onClick={ actions.reloadRepo.bind(null, repo.dir) }
      >
        <Isvg src='./svg/reload.svg'/>
      </i>

      <div className='content'>
        <div className='title' title={repo.dir + ' '}>
          { repo.name ? repo.name : basename(repo.dir) }
        </div>

        <div className='branch'>
          @ { repo.branch }
        </div>

        <div className='status'>
          { repo.ahead ?
            <span className='ahead'>Ahead: { repo.ahead }</span> : ''
          }

          { repo.behind ?
            <span className='behind'>Behind: { repo.behind }</span> : ''
          }

          { (repo.modified && repo.modified.length) ?
            <span className='modified'>Modified: { repo.modified.length }</span> : ''
          }
        </div>

        <div className='updated' title='Updated from now' 
        // ref={ this.updateDate.bind(this) }
        >
          { moment(repo.lastUpdate).fromNow() }
        </div>
      </div>
    </div>
  );
};

RepoComponent.propTypes = {
  repo: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps = {}) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  const repos = group.repos;
  const repo = repos.filter(r => r.dir === ownProps['repo-dir'])[0]

  return { repo, group: { id: ownProps['group-id'] } };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const Repo = connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoComponent);

export default Repo;
