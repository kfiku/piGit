import { IRepo } from '../../interfaces/IRepo';
import * as React from 'react';

import FileList from './FileList';
import StashList from './StashList';
import CommitBox from './CommitBox';


interface StatusesListProps {
  repo: IRepo;
}

class StatusesList extends React.PureComponent<StatusesListProps> {
  onKeyPress(e) {
    if (e.keyCode === 13 && e.ctrlKey) {
      const msg = e.target.value;
      if (msg.length < 2) {
        alert('No commit message or commit to short');
        return;
      }

      if (this.props.repo.staged.length === 0) {
        alert('No files to commit');
        return;
      }

      console.log('commit with msg', `"${msg}"`);
    }
  }

  render () {
    const { repo } = this.props;
    return (
      <div>
        <CommitBox repo={repo} />
        <FileList files={repo.staged} repo={repo} title='Staged' />
        <FileList files={repo.unstaged} repo={repo} title='Changed' alwaysShow />
        <FileList files={repo.conflicted} repo={repo} title='CONFLICTED' />
        <StashList stashes={repo.stashes} repo={repo} title='Stashes' />
      </div>
    );
  }
}

export default StatusesList;
