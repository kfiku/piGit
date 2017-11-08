import * as React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import { g7 } from '../../utils/styles';
import actionsToConnect from '../../actions';
const Revert = require('react-icons/lib/md/undo');
const Plus = require('react-icons/lib/md/add');
const Minus = require('react-icons/lib/md/remove');
import { IFile } from './File';
import { Wrapper as BaseWrapper, Action as BaseAction } from './FileActions';

const Wrapper = styled(BaseWrapper)`
  display: block;
`;

const Action = styled(BaseAction)`
  svg {
    fill: ${g7};
  }
`;

function confirmCheckoutAll () {
  return confirm(`Are you sure you want to discard changes in all files`);
}

function addAll(repo: IRepo, files: IFile[], addFile) {
  files.map(file => addFile(repo.id, repo.dir, file.path));
}

function unAddAll(repo: IRepo, files: IFile[], unAddFile) {
  files.map(file => unAddFile(repo.id, repo.dir, file.path));
}

function checkoutAll(repo: IRepo, files: IFile[], checkoutFile, deleteFile) {
  files.map(file => {
    if (file.type === '?') {
      deleteFile(repo.id, repo.dir, file.path);
    } else {
      checkoutFile(repo.id, repo.dir, file.path);
    }
  });
}

interface IBatchActions {
  repo: IRepo;
  files: IFile[];
  type: string;
  addFile?: any;
  unAddFile?: any;
  checkoutFile?: any;
  deleteFile?: any;
}

export function BatchActionsComponent ({
  files, repo, type,
  addFile, checkoutFile, deleteFile, unAddFile
}: IBatchActions) {
  switch (type) {
    case 'unstaged':
      return (
        <Wrapper>
          <Action
            onClick={() =>
              confirmCheckoutAll() &&
              checkoutAll(repo, files, checkoutFile, deleteFile)
            }
            title='Revert changes on all files'
          >
            <Revert />
          </Action>

          <Action
            onClick={() => addAll(repo, files, addFile)}
            title='Add all files to commit'
          >
            <Plus />
          </Action>
        </Wrapper>
      );
    case 'staged':
      return (
        <Wrapper>
          <Action
            onClick={() => unAddAll(repo, files, unAddFile)}
            title='Unstaged all changes in all files'
          >
            <Minus />
          </Action>
        </Wrapper>
      );
    default:
      return null;
  }
}

const mapStateToProps = () => {
  // const repo = state.repos.filter(r => r.id === state.app.repoShown)[0];

  return { };
};

const mapDispatchToProps = dispatch => ({
  addFile: bindActionCreators(actionsToConnect.addFile, dispatch),
  unAddFile: bindActionCreators(actionsToConnect.unAddFile, dispatch),
  checkoutFile: bindActionCreators(actionsToConnect.checkoutFile, dispatch),
  deleteFile: bindActionCreators(actionsToConnect.deleteFile, dispatch)
});

const BatchActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchActionsComponent as React.SFC);

export default BatchActions as React.ComponentClass<IBatchActions>;

