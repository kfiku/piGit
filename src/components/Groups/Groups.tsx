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

interface Props {
  groups: IGroup[];
  isShownRepo: boolean;
  actions: any;
}

const GroupsComponent: any = ({groups, isShownRepoDetails, actions}: Props) => {
  renderLog('GROUPS', groups.length, isShownRepoDetails);

  const groupsNodes = groups.map((group, i) => {
    console.log(group, i);
    return (
      <Group key={ group.id } group-id={ group.id } group-i={ i } />
    );
  });

  const style: any = {};

  if (isShownRepoDetails) {
    style.display = 'none';
  }

  return (
    <div style={style} ref={ sortableGroups.bind(null, actions) }>
      { groupsNodes }
    </div>
  );
};

GroupsComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  groups: state.groups,
  isShownRepoDetails: !!state.app.repoShown
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsComponent);
