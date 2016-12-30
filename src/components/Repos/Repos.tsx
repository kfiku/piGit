import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../../actions';
import { renderLog } from '../../helpers/logger';
import Repo from './Repo';

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

const ReposComponent: any = ({repos, group, actions}: { repos: IRepo[], group: IGroup, actions: any }) => {
  renderLog('REPOS', repos.length);

  let reposNodes = repos.map(repo => (
    <Repo key={ repo.dir } group-id={ group.id } repo-dir={ repo.dir } />
  ))

  return (
    <div className='repos'>
      { reposNodes }
    </div>
  );
};

ReposComponent.propTypes = {
  repos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps = {}) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  const repos = group.repos;
  return { repos, group: { id: ownProps['group-id'] } };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const Repos = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReposComponent);

export default Repos;
