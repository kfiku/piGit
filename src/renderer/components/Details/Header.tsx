import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import styled from 'styled-components';

const Isvg = require('react-inlinesvg');
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import Status from '../Repos/Status';

import GitGuiBtn from './GitGuiBtn';
import GitKBtn from './GitKBtn';

const StyledHeader = styled.header`

`;

interface HeaderProps {
  repo: IRepo;
  actions: any;
}

function Header({ repo, actions }: HeaderProps) {
  return (
    <StyledHeader>
      <h2 className='header'>
        { repo.name } @ { repo.branch }
        <Status repo={repo} inline />
      </h2>

      <Icon
        className='icon icon-x'
        title='Close'
        onClick={ actions.hideRepoDetails.bind(null) }
      >
        <Isvg src='./svg/x.svg'/>
      </Icon>

      <footer className='footer'>
        <Button onClick={ actions.reloadRepo.bind(null, repo.id, repo.dir) } className='button'>
          <Icon spin={repo.progressing} className='icon icon-refresh' title='Refresh this repo'>
            <Isvg src='./svg/reload.svg'/>
          </Icon>

          <span>Reload</span>
        </Button>

        <Button onClick={ actions.pullRepo.bind(null, repo.id, repo.dir) } className='button'>
          <Icon className='icon icon-pull' title='Pull this repo'>
            <Isvg src='./svg/down-arrow.svg'/>
          </Icon>

          <span>Pull</span>
        </Button>

        <GitGuiBtn repo={repo} />
        <GitKBtn repo={repo} />
      </footer>

    </StyledHeader>
  );
}


export default Header;
