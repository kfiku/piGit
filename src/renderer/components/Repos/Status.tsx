import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';

import StyledStatus,
{
  Ahead,
  Behind,
  Modified,
  Untracked,
  Deleted,
  Renamed
} from './StyledStatus';


interface StatusProps {
  repo: IRepo;
}

function Status ({ repo }: StatusProps) {
  const a = repo.ahead > 0 && repo.ahead;
  const b = repo.behind > 0 && repo.behind;
  const m = repo.modified && repo.modified.length > 0 && repo.modified.length;
  const u = repo.untracked && repo.untracked.length > 0 && repo.untracked.length;
  const d = repo.deleted && repo.deleted.length > 0 && repo.deleted.length;
  const r = repo.renamed && repo.renamed.length > 0 && repo.renamed.length;

  return (
    <StyledStatus>
      { a && <Ahead>{ a }</Ahead> }
      { b && <Behind>{ b }</Behind> }
      { m && <Modified>{ m }</Modified> }
      { u && <Untracked>
        { m ? `...${u}` : ` ?${u}` }
      </Untracked> }
      { d && <Deleted>{ d }</Deleted> }
      { r && <Renamed>{ r }</Renamed> }
    </StyledStatus>
  );
}

/* ↓↑×→✔ */

export default Status;
