import * as React from 'react';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

const Isvg = require('react-inlinesvg');

const NavComponent: any = ({app, actions})  => {
  return (
    <nav className='nav main-nav'>
      <button onClick={ actions.addRepos } className={ 'button' + (app.addingRepos ? ' is-loading' : '') } >
        <i className='icon icon-add'>
          <Isvg src='./svg/add.svg'/>
        </i>
        <span>Add Repo</span>
      </button>

      <button onClick={ actions.addGroup } className='button'>
        <i className='icon icon-add'>
          <Isvg src='./svg/add.svg'/>
        </i>
        <span>Add Group</span>
      </button>

      <button onClick={ actions.reloadAllRepos } className={ 'button' + (app.reloadingAllRepos ? ' is-loading' : '') } >
        <i className='icon icon-refresh'>
          <Isvg src='./svg/spin-1.svg'/>
        </i>
        <span>Reload all</span>
      </button>

      { /*
      <div className='nav-right'>
        <span className='nav-item'>
          <button className='button' >
            <span className='icon'>
              <i className='fa fa-paypal'></i>
            </span>
            <span>Donate</span>
          </button>
        </span>
      </div>
      */ }
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

export const Nav = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavComponent);
