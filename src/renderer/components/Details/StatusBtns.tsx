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
  const { id, dir, pulling, stats, progressing } = repo;
  return (
    <Wrapper>
      {!!stats.behind ? (
        <Button
          inside
          onClick={() => pullRepo(id, dir)}
          title='Pull this repo'
        >
          <Icon upAndDown={pulling} className='icon icon-pull'>
            <ArrowDown />
          </Icon>
        </Button>
      ) : stats.ahead ? (
        <Button
          inside
          onClick={() => pushRepo(id, dir)}
          title='Push to this repo'>
          <ArrowUp />
        </Button>
      ) : null}

      <Button
        inside
        onClick={() => reloadRepo(id, dir)}
        title='Refresh this repo'
      >
        <Icon spin={progressing} className='icon icon-refresh'>
          <Reload />
        </Icon>
      </Button>
    </Wrapper>
  );
}


export default StatusBtns;
