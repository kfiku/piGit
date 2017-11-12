import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import styled from 'styled-components';

import { g2, lh, detailsHeaderHeight } from '../../utils/styles';
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import ArrowLeft from '../Icons/ArrowLeft';
import ArrowUp from '../Icons/ArrowUp';
import ArrowDown from '../Icons/ArrowDown';
import Reload from '../Icons/Reload';
import Stats from '../Repos/Stats';

import GitKBtn from './GitKBtn';
import TermBtn from './TermBtn';

const StyledHeader = styled.header`
  display: flex;
  height: ${detailsHeaderHeight}px;
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
        <Stats stats={repo.stats} inline />
      </h2>

      <div className='buttons'>

      {repo.stats.behind ? (
          <Button onClick={actions.pullRepo.bind(null, repo.id, repo.dir)} title='Pull this repo'>
            <ArrowDown />
          </Button>
        ) : repo.stats.ahead ? (
          <Button
            onClick={actions.pushRepo.bind(null, repo.id, repo.dir)}
            title='Push to this repo'>
            <ArrowUp />
          </Button>
        ) : null}

        <Button
          onClick={ actions.reloadRepo.bind(null, repo.id, repo.dir) } title='Refresh this repo'>
          <Icon spin={repo.progressing} className='icon icon-refresh'>
            <Reload />
          </Icon>
        </Button>

        <GitKBtn repo={repo} />
        <TermBtn repo={repo} />
      </div>

    </StyledHeader>
  );
}

export default Header;
