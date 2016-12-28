import * as React from 'react';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

import Group from './Group';

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
      handle: '.icon-move',
      draggable: '.group',
      forceFallback: true,
      onUpdate: onUpdateGroup.bind(null, actions),
    };

    Sortable.create(el, options);
  }
};

const GroupsComponent: any = ({groups, actions}) => {
  console.log('/// RENDER GROUPS');

  let groupsNodes = groups.map((group) => {
    return (
      <Group key={ group.id } group-id={ group.id } />
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
