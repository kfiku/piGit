import * as React from 'react'; // tslint:disable-line
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';


import { navHeight, g2 } from '../utils/styles';

const StyledNav = styled.nav`
  width: 100%;
  height: ${navHeight}px;
  background: ${g2};
  top: 0;
  left: 0;
  position: fixed;
  z-index: 10;
`;

import actionsToConnect from '../actions';
import { renderLog } from '../helpers/logger';
import Button from './helpers/Button';
import Icon from './helpers/Icon';
import Add from './Icons/Add';
import Reload from './Icons/Reload';
import Folder from './Icons/Folder';

const NavComponent: any = ({app, actions}) => {
  renderLog('NAV');
  return (
    // <StyledNav className='nav main-nav'>
    <StyledNav>
      <Button onClick={ actions.addRepos } className={app.addingRepos ? 'progressing' : ''} >
        <Icon>
          {app.addingRepos ?
            <Reload /> :
            <Add />
          }
        </Icon>

        <span>Add Repo</span>
      </Button>

      <Button onClick={ actions.addGroup } className='button'>
        <Icon>
          <Folder />
        </Icon>
        <span>Add Group</span>
      </Button>

      <Button onClick={ actions.reloadAllRepos }
      className={ 'button' + (app.reloadingAllRepos ? ' progressing' : '') } >
        <Icon>
          <Reload />
        </Icon>
        <span>Reload all</span>
      </Button>
    </StyledNav>
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
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const Nav = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavComponent);

export default Nav;
