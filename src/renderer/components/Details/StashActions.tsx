import * as React from 'react';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import { stashDrop, stashApplyWithDrop } from '../../actions/reposActions';
import { IStash } from '../../interfaces/IGit';
import { Action, Wrapper } from './FileActions';

const Check = require('react-icons/lib/fa/check');
const Trash = require('react-icons/lib/fa/trash-o');

function confirmDrop (stash) {
  return confirm(`Are you sure you want to drop this stash: ${stash}`);
}
interface IStashActions {
  stash: IStash;
  className: string;
  repo: IRepo;
  dispatchStashDrop?: any;
  dispatchStashApplyWithDrop?: any;
}

export function StashActionsComponent ({
  stash, className, repo, dispatchStashDrop, dispatchStashApplyWithDrop
}: IStashActions) {
  return (
    <Wrapper className={className}>
      <Action
        onClick={() => {
          if (confirmDrop(stash.message)) {
            dispatchStashDrop(repo.id, repo.dir, stash.id);
          }
        }}
        title='Drop this stash'
      >
        <Trash />
      </Action>

      <Action
        onClick={() => dispatchStashApplyWithDrop(repo.id, repo.dir, stash.id)}
        title='Apply this stash and drop'
      >
        <Check />
      </Action>
    </Wrapper>
  );
}

const mapStateToProps = () => {
  return { };
};

const mapDispatchToProps = {
  dispatchStashDrop: stashDrop,
  dispatchStashApplyWithDrop: stashApplyWithDrop
};

const StashActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(StashActionsComponent as React.SFC);

export default StashActions as any;

