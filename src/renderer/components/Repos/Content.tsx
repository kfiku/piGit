import * as React from 'react';
import styled from 'styled-components';

import { IRepo } from '../../interfaces/IRepo';
import {
  repoSize,
  styledFont,
  g4
} from '../../utils/styles';

import Stats from './Stats';

const Wrapper = styled.div`
  position: absolute;
  z-index: 1;
  text-align: center;

  // CENTERING
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & > div {
    margin: 4px 0;
  }
` as any;

const Title = styled.div`
  font-family: ${styledFont};
  margin-top: ${repoSize / 3.5}px;
  font-size: 1em;
  line-height: 1em;
  word-break: break-all;
  cursor: pointer;
  pointer-events: all;
`;

const Branch = styled.div`
  font-size: 0.75em;
  color: ${g4};
`;

interface IIconsProps {
  repo: IRepo;
  showRepoDetails: () => {};
}

export default function Icons (
  {
    repo,
    showRepoDetails
  }: IIconsProps
) {
  return (
    <Wrapper>
      <Title className='title' title={repo.dir + ' '} onClick={showRepoDetails}>
        {repo.name}
      </Title>

      <Branch className='branch'>
        @{repo.branch}
      </Branch>

      <Stats stats={repo.stats} />
    </Wrapper>
  );
}
