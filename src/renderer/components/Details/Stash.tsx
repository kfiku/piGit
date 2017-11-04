import * as React from 'react';
// import { basename } from 'path';

import { IRepo } from '../../interfaces/IRepo';
import { FileName, Li } from './File';
// import Type from './StashStatusType';
import Actions from './StashActions';

export interface IStash {
  message: string;
  date: string;
  id: string;
}
interface IStashComp {
  stash: IStash;
  repo: IRepo;
}

export default function Stash ({stash, repo}: IStashComp) {
  if (!stash || !stash.message) { return null; }

  const { message, date } = stash;
  return (
    <Li title={`${message} on ${date}`}>
      <FileName>
        { message }
      </FileName>

      <Actions className='file-actions' stash={stash} repo={repo} />
    </Li>
  );
}
