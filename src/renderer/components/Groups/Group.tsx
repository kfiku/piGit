import { IGroup } from '../../interfaces/IGroup';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actionsToConnect from '../../actions';
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
import StyledGroupHeader from './StyledGroupHeader';

// const Isvg = require('react-inlinesvg');

const onChangeGroupName = (actions, id: string) => {
  const input = document.querySelector('input#groupInput_' + id) as HTMLInputElement;
  actions.editGroup(id, input.value);
};

const onKeyUpGroupName = (actions, id: string, e) => {
  if (e.key === 'Enter') {
    onChangeGroupName(actions, id);
  }
};

const focusInput = el => {
  if (el) {
    el.focus();
  }
};


const GroupComponent: any = ({ group, actions, i }: { group: IGroup, actions: any, i: number }) => {
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
        <Icon className='icon icon-edit'>
          <Edit />
        </Icon>

        <div className='title-box'>
          <input id={ 'groupInput_' + group.id } className='title' defaultValue={ group.title }
          ref={ focusInput }
          onKeyPress={ onKeyUpGroupName.bind(null, actions, group.id) }
          />
        </div>

        <div>
          <Icon className='icon icon-save' title='Save Title'
          onClick={ onChangeGroupName.bind(null, actions, group.id) }
          >
            <Save />
          </Icon>
        </div>
      </StyledGroupHeader>
    );
  } else {
    header = (
      <StyledGroupHeader>
        <Icon className='icon icon-move group-mover' title='Reorder this group'>
          <Sort />
        </Icon>

        <div className='title-box'>
          <span className='title'
          onClick={ actions.startEditGroup.bind(null, group.id) }
          >
            { group.title }
          </span>
        </div>

        <Icon className='icon icon-pull' title='Pull all in this group'
        onClick={ actions.pullGroup.bind(null, group.id) }
        >
          <ArrowDown />
        </Icon>

        <Icon
          spin={group.progressing}
          className='icon icon-refresh'
          title='Reload all in this group'
          onClick={ actions.reloadGroup.bind(null, group.id) }
        >
          <Reload />
        </Icon>

        <Icon className='icon icon-edit' title='Edit this group'
        onClick={ actions.startEditGroup.bind(null, group.id) }
        >
          <Edit />
        </Icon>

        <Icon className='icon icon-x' title='Remove this group with all repos'
        onClick={ actions.confirmDeleteGroup.bind(null, group.id) }
        >
          <Garbage />
        </Icon>
      </StyledGroupHeader>
    );
  }

  return (
    <div className='group'>
      { group.confirmDelete
        ? <Confirm
            yes={ actions.deleteGroup.bind(null, group.id) }
            no={ actions.cancelDeleteGroup.bind(null, group.id) }
            msg={ `Do you really want to remove group '${group.title}' with all repos inside?` }/>
        : ''
      }

      { header }

      <Repos key={ group.id } group-id={ group.id } group-i={ i } />
    </div>
  );
};

GroupComponent.propTypes = {
  group: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  i: PropTypes.number.isRequired,
};


const mapStateToProps = (state, ownProps) => {
  // console.log(ownProps['group-id'], state.groups);
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  // console.log({ group, i: ownProps['group-i'] });
  return { group, i: ownProps['group-i'] };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const Group = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupComponent);

export default Group;
