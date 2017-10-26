import * as React from 'react';
import styled from 'styled-components';

import { lh } from '../../utils/styles';
import Stash, { IStash } from './Stash';
import { IRepo } from '../../interfaces/IRepo';

import { Wrapper, Title, Ul } from './FileList';


interface IStashListProps {
  stashes: IStash[];
  title: string;
  repo: IRepo;
}

export default function StashList ({ stashes, title, repo }: IStashListProps) {
  return (
    <Wrapper>
      <Title>{title} ({stashes && stashes.length}): </Title>
      {<Ul>
        {stashes && stashes.map(stash =>
          // <Stash key={stash.path} Stash={Stash} repo={repo} />
          <Stash key={stash.hash} stash={stash} repo={repo} />
        )}
      </Ul>}
    </Wrapper>
  );
}
