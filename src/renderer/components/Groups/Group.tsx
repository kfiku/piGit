import * as React from 'react';
import { connect } from 'react-redux';

import { IGroup } from '../../interfaces/IGroup';
import {
  editGroup,
  startEditGroup,
  pullGroup,
  reloadGroup,
  confirmDeleteGroup,
  deleteGroup,
  cancelDeleteGroup
} from '../../actions/groupsActions';
import Confirm from '../helpers/Confirm';
import Repos from '../Repos/Repos';
import Icon from '../helpers/Icon';
import Edit from '../Icons/Edit';
import Garbage from '../Icons/Garbage';
import Sort from '../Icons/Sort';
import Reload from '../Icons/Reload';
import Save from '../Icons/Save';
import ArrowDown from '../Icons/ArrowDown';
import { renderLog } from '../../helpers/logger';
import StyledGroup from './StyledGroup';
import StyledGroupHeader from './StyledGroupHeader';

const onChangeGroupName = (dispatchEditGroup, id: string) => {
  const input = document.querySelector('input#groupInput_' + id) as HTMLInputElement;
  dispatchEditGroup(id, input.value);
};

const onKeyUpGroupName = (dispatchEditGroup, id: string, e) => {
  if (e.key === 'Enter') {
    onChangeGroupName(dispatchEditGroup, id);
  }
};

const focusInput = el => {
  if (el) {
    el.focus();
  }
};


interface Props {
  group: IGroup;
  actions: any;
  dispatchEditGroup: any;
  dispatchStartEditGroup: any;
  dispatchPullGroup: any;
  dispatchReloadGroup: any;
  dispatchConfirmDeleteGroup: any;
  dispatchDeleteGroup: any;
  dispatchCancelDeleteGroup: any;
  i: number;
}
const GroupComponent: any = ({
  group,
  dispatchEditGroup,
  dispatchStartEditGroup,
  dispatchPullGroup,
  dispatchReloadGroup,
  dispatchConfirmDeleteGroup,
  dispatchDeleteGroup,
  dispatchCancelDeleteGroup,
  i
}: Props) => {
  renderLog(
    'GROUP',
    group.title,
    group.editing && 'editing',
    group.confirmDelete && 'confirm delete'
  );
  let header;

  if (group.editing) {
    /** ON GROUP EDITING */
    header = (
      <StyledGroupHeader className='group-header editing'>
        {/* <Icon className='icon icon-edit'>
          <Edit />
        </Icon> */}

        <div className='title-box'>
          <input id={ 'groupInput_' + group.id } className='title' defaultValue={ group.title }
          ref={ focusInput }
            onKeyPress={(e) => onKeyUpGroupName(dispatchEditGroup, group.id, e) }
          />
        </div>

        <div>
          <Icon
            className='icon icon-save'
            title='Save Title'
            onClick={() => onChangeGroupName(dispatchEditGroup, group.id)}
          >
            <Save />
          </Icon>
        </div>
      </StyledGroupHeader>
    );
  } else {
    header = (
      <StyledGroupHeader>
        {/* <Icon className='icon icon-move group-mover' title='Reorder this group'>
          <Sort />
        </Icon> */}

        <div className='title-box'>
          <span className='title'
          onClick={ dispatchStartEditGroup.bind(null, group.id) }
          >
            { group.title }
          </span>
        </div>

        <div>
          <Icon className='icon icon-pull' title='Pull all in this group'
          onClick={ dispatchPullGroup.bind(null, group.id) }
          >
            <ArrowDown />
          </Icon>

          <Icon
            spin={group.progressing}
            className='icon icon-refresh'
            title='Reload all in this group'
            onClick={ dispatchReloadGroup.bind(null, group.id) }
          >
            <Reload />
          </Icon>

          <Icon className='icon icon-edit' title='Edit this group'
          onClick={ dispatchStartEditGroup.bind(null, group.id) }
          >
            <Edit />
          </Icon>

          <Icon className='icon icon-x' title='Remove this group with all repos'
          onClick={ dispatchConfirmDeleteGroup.bind(null, group.id) }
          >
            <Garbage />
          </Icon>
        </div>
      </StyledGroupHeader>
    );
  }

  return (
    <StyledGroup>
      { group.confirmDelete
        ? <Confirm
            yes={ dispatchDeleteGroup.bind(null, group.id) }
            no={ dispatchCancelDeleteGroup.bind(null, group.id) }
            msg={ `Do you really want to remove group '${group.title}' with all repos inside?` }/>
        : ''
      }

      { header }

      <Repos key={ group.id } group-id={ group.id } group-i={ i } />
    </StyledGroup>
  );
};

const mapStateToProps = (state, ownProps) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  return { group, i: ownProps['group-i'] };
};

const mapDispatchToProps = {
  dispatchEditGroup: editGroup,
  dispatchStartEditGroup: startEditGroup,
  dispatchPullGroup: pullGroup,
  dispatchReloadGroup: reloadGroup,
  dispatchConfirmDeleteGroup: confirmDeleteGroup,
  dispatchDeleteGroup: deleteGroup,
  dispatchCancelDeleteGroup: cancelDeleteGroup,
};

const Group = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupComponent);

export default Group;
