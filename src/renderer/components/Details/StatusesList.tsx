import { IRepo } from '../../interfaces/IRepo';
import * as React from 'react';

import FileList from './FileList';
import StashList from './StashList';
import CommitBox from './CommitBox';
import StatusBtns from './StatusBtns';
interface StatusesListProps {
  actions: any;
  repo: IRepo;
}

function StatusesList({ repo, actions }: StatusesListProps) {
  const { staged, unstaged, conflicted, stashes } = repo.lists;
  return (
    <div>
      <StatusBtns repo={repo} actions={actions} />
      <CommitBox repo={repo} />
      <FileList files={staged} repo={repo} title='Staged' type='staged' />
      <FileList files={unstaged} repo={repo} title='Changed' type='unstaged' alwaysShow />
      <FileList files={conflicted} repo={repo} title='Conflicted' type='conflicted' />
      <StashList stashes={stashes} repo={repo} title='Stashes' />
    </div>
  );
}


export default StatusesList;
