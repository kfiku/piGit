import { IGroup } from '../interfaces/IGroup';

import * as React from 'react';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';
import Confirm from './helpers/Confirm';
import Repos from './Repos/Repos';
import { renderLog } from '../helpers/logger';
// import { Repo } from './Repo';
// import Sortable = require('sortablejs');

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


const GroupComponent: any = ({ group, actions }: { group: IGroup, actions: any }) => {
  renderLog('GROUP', group.title, group.editing && 'editing', group.confirmDelete && 'confirm delete');
  let header;

  if (group.editing) {
    /** ON GROUP EDITING */
    header = (
      <header className='group-header editing'>
        <span className='icon icon-edit'>
          <Isvg src='./svg/edit.svg'/>
        </span>

        <input id={ 'groupInput_' + group.id } className='title' defaultValue={ group.title }
        ref={ focusInput }
        onKeyPress={ onKeyUpGroupName.bind(null, actions, group.id) }
        />

        <span className='icon icon-save' title='Save Title'
        onClick={ onChangeGroupName.bind(null, actions, group.id) }
        >
          <Isvg src='./svg/right-arrow-6.svg'/>
        </span>
      </header>
    );
  } else {
    header = (
      <header className='group-header'>
        <i className='icon icon-move' title='Reorder this group'>
          <Isvg src='./svg/sort.svg'/>
        </i>

        <span className='title'
        onClick={ actions.startEditGroup.bind(null, group.id) }
        >
          { group.title }
        </span>

        <i className='icon icon-edit' title='Remove this group with all repos'
        onClick={ actions.startEditGroup.bind(null, group.id) }
        >
          <Isvg src='./svg/edit.svg' />
        </i>

        <i className='icon icon-x' title='Remove this group with all repos'
        onClick={ actions.confirmDeleteGroup.bind(null, group.id) }
        >
          <Isvg src='./svg/garbage.svg' />
        </i>
      </header>
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

      <Repos key={ group.id } group-id={ group.id } />
    </div>
  );
};

GroupComponent.propTypes = {
  group: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps = {}) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  return { group };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const Group = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupComponent);

export default Group;
