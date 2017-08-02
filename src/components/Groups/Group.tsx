import { IGroup } from '../../interfaces/IGroup';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../../actions';
import Confirm from '../helpers/Confirm';
import Repos from '../Repos/Repos';
import Icon from '../helpers/Icon';
import { renderLog } from '../../helpers/logger';
import StyledGroupHeader from './StyledGroupHeader';

const Isvg = require('react-inlinesvg');

const onChangeGroupName = (actions, id: string) => {
  const inpt = document.querySelector('input#groupInput_' + id) as HTMLInputElement;
  actions.editGroup(id, inpt.value);
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
  // renderLog('GROUP');
  // console.log(group);
  renderLog('GROUP', group.title, group.editing && 'editing', group.confirmDelete && 'confirm delete');
  let header;

  if (group.editing) {
    /** ON GROUP EDITING */
    header = (
      <StyledGroupHeader className='group-header editing'>
        <Icon className='icon icon-edit'>
          <Isvg src='./svg/edit.svg'/>
        </Icon>

        <div className='title-box'>
          <input id={ 'groupInput_' + group.id } className='title' defaultValue={ group.title }
          ref={ focusInput }
          onKeyPress={ onKeyUpGroupName.bind(null, actions, group.id) }
          />
        </div>

        <Icon className='icon icon-save' title='Save Title'
        onClick={ onChangeGroupName.bind(null, actions, group.id) }
        >
          <Isvg src='./svg/right-arrow-6.svg'/>
        </Icon>
      </StyledGroupHeader>
    );
  } else {
    header = (
      <StyledGroupHeader>
        <Icon className='icon icon-move group-mover' title='Reorder this group'>
          <Isvg src='./svg/sort.svg'/>
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
          <Isvg src='./svg/down-arrow.svg' />
        </Icon>

        <Icon spin={group.progressing} className='icon icon-refresh' title='Reload all in this group'
        onClick={ actions.reloadGroup.bind(null, group.id) }
        >
          <Isvg src='./svg/reload.svg' />
        </Icon>

        <Icon className='icon icon-edit' title='Edit this group'
        onClick={ actions.startEditGroup.bind(null, group.id) }
        >
          <Isvg src='./svg/edit.svg' />
        </Icon>

        <Icon className='icon icon-x' title='Remove this group with all repos'
        onClick={ actions.confirmDeleteGroup.bind(null, group.id) }
        >
          <Isvg src='./svg/garbage.svg' />
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
  actions: bindActionCreators(actions, dispatch)
});

const Group = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupComponent);

export default Group;
