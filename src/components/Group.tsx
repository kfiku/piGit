import * as React from 'react';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

import { IGroup } from '../interfaces/IGroup';
// import { Repo } from './Repo';
// import Sortable = require('sortablejs');

const Isvg = require('react-inlinesvg');

const onKeyUpGroupName = (id: string) => {
  console.log('onKeyUpGroupName', id);
};

const onChangeGroupName = (id: string) => {
  console.log('onChangeGroupName', id);
};


const GroupComponent: any = ({ group, actions }: { group: IGroup, actions: any }) => {
  console.log('/// RENDER GROUP');
  let header;

  console.log(group.editing);
  if (group) {
    if (group.editing) {
      /** ON GROUP EDITING */
      header = (
        <header className='editing'>
          <i className='icon icon-edit'>
            <Isvg src='./svg/edit.svg' />
          </i>

          <input id={ 'groupInput_' + group.id } className='title' defaultValue={ group.title }
          // ref={ this.focusInput.bind(this) }
          // onKeyPress={ onKeyUpGroupName(group.id) }
          />

          <i className='icon icon-save' title='Save Title'
          // onClick={ onChangeGroupName(group.id) }
          >
            <Isvg src='./svg/right-arrow-6.svg'/>
          </i>
        </header>
      );
    } else {
      /** ON NORMAL GROUP */
      header = (
        <header>
          <i className='icon icon-move' title='Reorder this group'>
            <Isvg src='./svg/sort.svg'/>
          </i>

          <span className='title'
          onClick={ actions.startEditGroup.bind(null, group.id) }
          >
            { group.title }
          </span>
        {/* * /}

          <i className='icon icon-edit' title='Edit group name'
          // onClick={ actions.startEditGroup(group.id) }
          >
            <Isvg src='./svg/edit.svg' />
          </i>
          <i className='icon icon-x' title='Remove this group with all repos'
          // onClick={ actions.confirmDeleteGroup(group.id) }
          >
            <Isvg src='./svg/garbage.svg' />
          </i>
        {/* */}
        </header>
      );
    }

  }

  return (
    <div className='group'>
      { header }
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
