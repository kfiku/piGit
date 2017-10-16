import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import styled from 'styled-components';

const Isvg = require('react-inlinesvg');
import { g2, lh } from '../../utils/styles';
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import ArrowLeft from '../Icons/ArrowLeft';
import Status from '../Repos/Status';

import GitGuiBtn from './GitGuiBtn';
import GitKBtn from './GitKBtn';

const StyledHeader = styled.header`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: center;

  background: ${g2};

  .back {
    margin-right: ${lh}px;
  }

  h2 {
    flex: 1;
  }
`;

interface HeaderProps {
  repo: IRepo;
  actions: any;
}

function Header({ repo, actions }: HeaderProps) {
  return (
    <StyledHeader>
      <Button onClick={ actions.hideRepoDetails.bind(null) } title='Close' className='back'>
        <ArrowLeft />
      </Button>

      <h2>
        { repo.name } @ { repo.branch }
        <Status repo={repo} inline />
      </h2>

      <div className='buttons'>
        <Button
          onClick={ actions.reloadRepo.bind(null, repo.id, repo.dir) } title='Refresh this repo'>
          <Icon spin={repo.progressing} className='icon icon-refresh'>
            <Isvg src='./svg/reload.svg'/>
          </Icon>

          {/* <span>Reload</span> */}
        </Button>

        <Button onClick={ actions.pullRepo.bind(null, repo.id, repo.dir) } title='Pull this repo'>
          <Icon className='icon icon-pull'>
            <Isvg src='./svg/down-arrow.svg'/>
          </Icon>

          {/* <span>Pull</span> */}
        </Button>

        <GitGuiBtn repo={repo} />
        <GitKBtn repo={repo} />
      </div>

    </StyledHeader>
  );
}


export default Header;
