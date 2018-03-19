import * as React from 'react'; // tslint:disable-line
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

import { renderLog } from '../helpers/logger';
import Button from './helpers/Button';
import Icon from './helpers/Icon';
import Add from './Icons/Add';
import Reload from './Icons/Reload';
import Folder from './Icons/Folder';

interface Props {
  app: any;
  addRepos: () => {};
  addGroup: () => {};
  reloadAllRepos: () => {};
}

const Nav: React.SFC<Props> = ({ app, addRepos, addGroup, reloadAllRepos}) => {
  renderLog('NAV');
  return (
    <StyledNav>
      <Button onClick={ addRepos } className={app.addingRepos ? 'progressing' : ''} >
        <Icon>
          {app.addingRepos ?
            <Reload /> :
            <Add />
          }
        </Icon>

        <span>Add Repo</span>
      </Button>

      <Button onClick={ addGroup } className='button'>
        <Icon>
          <Folder />
        </Icon>
        <span>Add Group</span>
      </Button>

      <Button onClick={ reloadAllRepos }
      className={ 'button' + (app.reloadingAllRepos ? ' progressing' : '') } >
        <Icon>
          <Reload />
        </Icon>
        <span>Reload all</span>
      </Button>
    </StyledNav>
  );
};

export default Nav;
