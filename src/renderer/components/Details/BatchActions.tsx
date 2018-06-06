import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import { g7 } from '../../utils/styles';
import { IFile } from '../../interfaces/IGit';
import { Wrapper as BaseWrapper, Action as BaseAction } from './FileActions';
import {
  addAllFiles,
  unAddAllFiles,
  checkoutFile,
  deleteFile,
} from '../../actions/fileActions';

const Revert = require('react-icons/lib/md/undo');
const Plus = require('react-icons/lib/md/add');
const Minus = require('react-icons/lib/md/remove');

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

function checkoutAll(repo: IRepo, files: IFile[], dispatchCheckoutFile, dispatchDeleteFile) {
  files.map(file => {
    if (file.type === '?') {
      dispatchDeleteFile(repo.id, repo.dir, file.path);
    } else {
      dispatchCheckoutFile(repo.id, repo.dir, file.path);
    }
  });
}

interface IBatchActions {
  repo: IRepo;
  files: IFile[];
  type: string;
  dispatchAddAllFiles?: Function;
  dispatchUnAddAllFiles?: Function;
  dispatchCheckoutFile?: Function;
  dispatchDeleteFile?: Function;
}

export function BatchActionsComponent ({
  files, repo, type,
  dispatchCheckoutFile, dispatchDeleteFile, dispatchUnAddAllFiles,
  dispatchAddAllFiles
}: IBatchActions) {
  // console.log(dispatchAddFile, dispatchCheckoutFile, dispatchDeleteFile, dispatchUnAddAllFiles);
  switch (type) {
    case 'unstaged':
      return (
        <Wrapper>
          <Action
            onClick={() =>
              confirmCheckoutAll() &&
              checkoutAll(repo, files, dispatchCheckoutFile, dispatchDeleteFile)
            }
            title='Revert changes on all files'
          >
            <Revert />
          </Action>

          <Action
            onClick={() => dispatchAddAllFiles(repo.id, repo.dir)}
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
            onClick={() => dispatchUnAddAllFiles(repo.id, repo.dir)}
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

const mapDispatchToProps = {
  dispatchAddAllFiles: addAllFiles,
  dispatchUnAddAllFiles: unAddAllFiles,
  dispatchCheckoutFile: checkoutFile,
  dispatchDeleteFile: deleteFile,
};

const BatchActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchActionsComponent as React.SFC);

export default BatchActions as any;

