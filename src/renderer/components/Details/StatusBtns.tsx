import { IRepo } from '../../interfaces/IRepo';
import * as React from 'react';
import styled from 'styled-components';
import { lh } from '../../utils/styles';

import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import ArrowUp from '../Icons/ArrowUp';
import ArrowDown from '../Icons/ArrowDown';
import Reload from '../Icons/Reload';

const Wrapper = styled.div`
  margin-top: ${lh / 2}px;
  text-align: center;

  button {
    width: ${lh * 3}px;
    height: ${lh * 2}px;

    i.icon, svg {
      width: 100%;
      height: 100%;
      margin: 0;
    }
  }
`;

interface StatusBtnsProps {
  pullRepo: Function;
  pushRepo: Function;
  reloadRepo: Function;
  repo: IRepo;
}

function StatusBtns({ repo, pullRepo, pushRepo, reloadRepo }: StatusBtnsProps) {
  return (
    <Wrapper>
      {repo.stats.behind ? (
        <Button
          inside
          onClick={() => pullRepo(repo.id, repo.dir)}
          title='Pull this repo'
        >
          <ArrowDown />
        </Button>
      ) : repo.stats.ahead ? (
        <Button
          inside
          onClick={() => pushRepo(repo.id, repo.dir)}
          title='Push to this repo'>
          <ArrowUp />
        </Button>
      ) : null}

      <Button
        inside
        onClick={() => reloadRepo(repo.id, repo.dir)}
        title='Refresh this repo'
      >
        <Icon spin={repo.progressing} className='icon icon-refresh'>
          <Reload />
        </Icon>
      </Button>
    </Wrapper>
  );
}


export default StatusBtns;
