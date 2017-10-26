import * as React from 'react';
// import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// const Isvg = require('react-inlinesvg');
const Check = require('react-icons/lib/fa/check');
const Trash = require('react-icons/lib/fa/trash-o');

import { IRepo } from '../../interfaces/IRepo';
import actionsToConnect from '../../actions';
// import { lh, g5, red } from '../../utils/styles';
// import Revert from '../Icons/Revert';
// const Plus = require('react-icons/lib/fa/plus');
// const Minus = require('react-icons/lib/fa/minus');
import { IStash } from './Stash';
import { Action, Wrapper } from './FileActions';


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

