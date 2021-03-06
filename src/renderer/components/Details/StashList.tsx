import * as React from 'react';

import { IRepo } from '../../interfaces/IRepo';
import { Wrapper, Title, Ul } from './FileList';
import Stash from './Stash';
import { IStash } from '../../interfaces/IGit';
interface IStashListProps {
  stashes: IStash[];
  title: string;
  repo: IRepo;
}

export default function StashList ({ stashes, title, repo }: IStashListProps) {
  if (stashes.length === 0) { return null; }

  return (
    <Wrapper>
      <Title>{title} ({stashes.length}): </Title>
      {<Ul>
        {stashes.map(stash =>
          <Stash key={stash.id} stash={stash} repo={repo} />
        )}
      </Ul>}
    </Wrapper>
  );
}
