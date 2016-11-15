import * as React from 'react';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../actions';

const NavComponent: any = ({app, actions})  => {
  return (
    <nav className='nav main-nav'>
      <div className='nav-left'>
        <span className='nav-item'>
          <button onClick={ actions.addRepos } className={ 'button' + (app.addingRepos ? ' is-loading' : '') } >
            <span className='icon'>
              <i className='fa fa-plus'></i>
            </span>
            <span>Add Repo</span>
          </button>

          <button onClick={ actions.reloadAllRepos } className={ 'button' + (app.reloadingAllRepos ? ' is-loading' : '') } >
            <span className='icon'>
              <i className='fa fa-refresh'></i>
            </span>
            <span>Reload all</span>
          </button>
        </span>
      </div>

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
