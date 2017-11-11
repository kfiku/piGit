import { IRepoStats } from '../../interfaces/IRepo';

import * as React from 'react';

import StyledStats,
{
  Ahead,
  Behind,
  Modified,
  Conflicted,
  Untracked,
  Stashes,
  Deleted,
  Renamed
} from './StyledStats';

function getTitle(
  { ahead, behind, modified, untracked, deleted, renamed, stashes, conflicted}: IRepoStats
): string {
  return [
    ahead && `Ahead: ${ahead}`,
    behind && `Behind: ${behind}`,
    conflicted && `Conflicted: ${conflicted}`,
    modified && `Modified: ${modified}`,
    untracked && `Untracked: ${untracked}`,
    deleted && `Deleted: ${deleted}`,
    renamed && `Renamed: ${renamed}`,
    stashes && `Stashes: ${stashes}`
  ]
  .filter(t => t)
  .join(', ') || 'Clean';
}

interface StatsProps {
  stats: IRepoStats;
  inline?: boolean;
}

function Stats ({ stats, inline }: StatsProps) {
  const {
    ahead, behind, modified, untracked, deleted, renamed, stashes, conflicted
  } = stats;

  return (
    <StyledStats inline={inline} title={getTitle(stats)}>
      { ahead && <Ahead>{ ahead }</Ahead> }
      { behind && <Behind>{ behind }</Behind> }
      { conflicted && <Conflicted>{ conflicted }</Conflicted> }
      { modified && <Modified>{ modified }</Modified> }
      { untracked && <Untracked>{ untracked }</Untracked> }
      { deleted && <Deleted>{ deleted }</Deleted> }
      { renamed && <Renamed>{ renamed }</Renamed> }
      { stashes && <Stashes>{ stashes }</Stashes> }
    </StyledStats>
  );
}

/* ↓↑×→✔ */

export default Stats;
