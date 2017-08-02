import { IGroup } from '../../interfaces/IGroup';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../../actions';
import Group from './Group';
import { renderLog } from '../../helpers/logger';

// import { IRepo } from '../interfaces/IRepo';
// import { Repo } from './Repo';
import Sortable = require('sortablejs');

const onUpdateGroup = (actions, event) => {
  actions.reorderGroup({
    oldIndex: event.oldIndex,
    newIndex: event.newIndex
  });
};

const sortableGroups = (actions, el) => {
  if (el) {
    let options = {
      animation: 150,
      handle: '.group-mover',
      draggable: '.group',
      forceFallback: true,
      onUpdate: onUpdateGroup.bind(null, actions),
    };

    Sortable.create(el, options);
  }
};

const GroupsComponent: any = ({groups, actions}: { groups: IGroup[], actions: any }) => {
  renderLog('GROUPS', groups.length);

  let groupsNodes = groups.map((group, i) => {
    console.log(group, i);
    return (
      <Group key={ group.id } group-id={ group.id } group-i={ i } />
    );
  });

  return (
    <div className='groups' ref={ sortableGroups.bind(null, actions) }>
      { groupsNodes }
    </div>
  );
};

GroupsComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  groups: state.groups
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const Groups = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsComponent);

export default Groups;
