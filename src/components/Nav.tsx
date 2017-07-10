import * as React from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';
import { renderLog } from '../helpers/logger';

const Isvg = require('react-inlinesvg');

const NavComponent: any = ({app, actions}) => {
  renderLog('NAV');
  return (
    <nav className='nav main-nav'>
      <button onClick={ actions.addRepos } className={ 'button' + (app.addingRepos ? ' progressing' : '') } >
        { app.addingRepos
          ? <span className='icon icon-refresh'>
              <Isvg src='./svg/reload.svg'/>
            </span>
          : <i className='icon icon-add'>
              <Isvg src='./svg/add.svg'/>
            </i>
        }

        <span>Add Repo</span>
      </button>

      <button onClick={ actions.addGroup } className='button'>
        <i className='icon icon-add'>
          <Isvg src='./svg/folder.svg'/>
        </i>
        <span>Add Group</span>
      </button>

      <button onClick={ actions.reloadAllRepos } className={ 'button' + (app.reloadingAllRepos ? ' progressing' : '') } >
        <i className='icon icon-refresh'>
          <Isvg src='./svg/reload.svg'/>
        </i>
        <span>Reload all</span>
      </button>
    </nav>
  );
};

NavComponent.propTypes = {
  app: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  app: state.app
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const Nav = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavComponent);

export default Nav;
