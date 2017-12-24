import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import actionsToConnect from '../../actions';
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
  stashDrop?: any;
  stashApplyWithDrop?: any;
}

export function StashActionsComponent ({
  stash, className, repo, stashDrop, stashApplyWithDrop
}: IStashActions) {
  return (
    <Wrapper className={className}>
      <Action
        onClick={() => {
          if (confirmDrop(stash.message)) {
            stashDrop(repo.id, repo.dir, stash.id);
          }
        }}
        title='Drop this stash'
      >
        <Trash />
      </Action>

      <Action
        onClick={stashApplyWithDrop.bind(null, repo.id, repo.dir, stash.id)}
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

const mapDispatchToProps = dispatch => ({
  stashDrop: bindActionCreators(actionsToConnect.stashDrop, dispatch),
  stashApplyWithDrop: bindActionCreators(actionsToConnect.stashApplyWithDrop, dispatch)
});

const StashActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(StashActionsComponent as React.SFC);

export default StashActions as React.ComponentClass<IStashActions>;

