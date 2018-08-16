import * as React from 'react';
import { connect } from 'react-redux';
import Sortable = require('sortablejs');

import { IGroup } from '../../interfaces/IGroup';
import { reorderGroup } from '../../actions/groupsActions';
import Group from './Group';
import StyledGroups from './StyledGroups';
import { renderLog } from '../../helpers/logger';


const onUpdateGroup = (dispatchReorderGroup, event) => {
  dispatchReorderGroup({
    oldIndex: event.oldIndex,
    newIndex: event.newIndex
  });
};

const sortableGroups = (dispatchReorderGroup, el) => {
  if (el) {
    let options = {
      animation: 150,
      handle: '.group-mover',
      draggable: '.group',
      forceFallback: true,
      onUpdate: onUpdateGroup.bind(null, dispatchReorderGroup),
    };

    Sortable.create(el, options);
  }
};

interface Props {
  groups: IGroup[];
  isShownRepoDetails: boolean;
  dispatchReorderGroup: any;
}

const GroupsComponent: any = ({ groups, isShownRepoDetails, dispatchReorderGroup}: Props) => {
  renderLog('GROUPS', groups.length);

  const groupsNodes = groups.map((group, i) => {
    return (
      <Group key={ group.id } group-id={ group.id } group-i={ i } />
    );
  });

  return (
    <StyledGroups innerRef={(el) => sortableGroups(dispatchReorderGroup, el) }>
      { groupsNodes }
    </StyledGroups>
  );
};

const mapStateToProps = state => ({
  groups: state.groups,
  isShownRepoDetails: !!state.app.repoShown
});

const mapDispatchToProps = {
  dispatchReorderGroup: reorderGroup
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsComponent);
