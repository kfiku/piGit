import * as React from 'react';
import styled from 'styled-components';

import { IRepo } from '../../interfaces/IRepo';
import {
  repoIconSize,
  repoBgSize,
  g3
} from '../../utils/styles';

import Icon from '../helpers/Icon';
import Reload from '../Icons/Reload';
import Move from '../Icons/Move';
import X from '../Icons/X';
import ArrowDown from '../Icons/ArrowDown';
import ArrowUp from '../Icons/ArrowUp';

const iconCenter = 50 - repoIconSize / 2;
const iconSide = (100 - repoBgSize) / 4;

const Wrapper = styled.div`
  .icon {
    position: absolute;
    z-index: 2;
    display: block;
    width: ${repoIconSize}%;
    height: ${repoIconSize}%;

    opacity: ${(p: any) => p.processing || p.active ? 1 : 0};
    will-change: opacity;
    transition: opacity 0.3s;
    pointer-events: all;
  }

  i svg {
    fill: ${g3};
  }

  .icon-move {
    top: ${iconSide}%;
    left: ${iconCenter}%;
    cursor: move;
  }

  .icon-refresh {
    bottom: ${iconSide}%;
    left: ${iconCenter}%;
  }

  .icon-pull,
  .icon-push {
    top: ${iconCenter}%;
    left: ${iconSide}%;
  }

  .icon-x {
    top: ${iconCenter}%;
    right: ${iconSide}%;
  }
` as any;

interface IIconsProps {
  active: boolean;
  repo: IRepo;
  deleteRepo: () => {};
  pullRepo: () => {};
  pushRepo: () => {};
  reloadRepo: () => {};
}

export default function Icons (
  {
    active,
    repo,
    deleteRepo,
    pullRepo,
    pushRepo,
    reloadRepo
  }: IIconsProps
) {
  return (
    <Wrapper active={active ? 1 : 0}>
      <Icon className='icon icon-move repo-mover' title='Reorder this repo'>
        <Move />
      </Icon>

      <Icon className='icon icon-x' title='Delete this repo' onClick={deleteRepo}>
        <X />
      </Icon>

      {!!repo.stats.behind && (
        <Icon className='icon icon-pull' title='Pull this repo' onClick={pullRepo}>
          <ArrowDown />
        </Icon>
      )}

      {!!repo.stats.ahead && !repo.stats.behind && (
        <Icon className='icon icon-push' title='push this repo' onClick={pushRepo}>
          <ArrowUp />
        </Icon>
      )}

      <Icon spin={repo.progressing} className='icon icon-refresh ' title='Refresh this repo' onClick={reloadRepo}>
        <Reload />
      </Icon>
    </Wrapper>
  );
}
