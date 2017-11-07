import * as React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import { lh, fileHeight, g5, red } from '../../utils/styles';
import actionsToConnect from '../../actions';
const Revert = require('react-icons/lib/md/undo');
const Plus = require('react-icons/lib/md/add');
const Minus = require('react-icons/lib/md/remove');
import { IFile } from './File';

const iconSize = fileHeight * 0.9;

export const Action = styled.span`
  display: inline-block;
  width: ${iconSize}px;
  height: ${iconSize}px;
  text-align: center;
  font-size: ${lh}px;
  font-weight: 700;
  vertical-align: middle;

  svg {
    fill: ${g5};
    width: ${iconSize}px;
    height: ${iconSize}px;
  }

  cursor: pointer;

  &:hover {
    svg {
      fill: ${red};
    }
  }
`;

export const Wrapper = styled.div`
  height: ${fileHeight}px;
  margin-right: ${lh / 4}px;
  display: none;
`;

function confirmCheckout (file) {
  return confirm(`Are you sure you want to discard changes in ${file}`);
}

function confirmDelete (file) {
  return confirm(`Are you sure you want to DELETE file: ${file}`);
}

interface IFileActions {
  file: IFile;
  className: string;
  repo: IRepo;
  addFile?: any;
  unAddFile?: any;
  checkoutFile?: any;
  deleteFile?: any;
}

export function FileActionsComponent ({
  file, className, repo, addFile, unAddFile, checkoutFile, deleteFile
}: IFileActions) {
  if (file.staged) {
    return (
      <Wrapper className={className}>
        <Action
          onClick={unAddFile.bind(null, repo.id, repo.dir, file.path)}
          title='Unstage changes on this file'
        >
          <Minus height={lh * 0.75} width={lh * 0.75} />
        </Action>
      </Wrapper>
    );
  }

  const checkoutOrDelete = file.type === '?'
    ?
      // DELETE FILE IF FILE IS UNTRACKED
      () => {
        if (confirmDelete(file.path)) {
          deleteFile(repo.id, repo.dir, file.path);
        }
      }
    :
      // CHECKOUT FILE IF FILE IS TRACKED
      () => {
        if (confirmCheckout(file.path)) {
          checkoutFile(repo.id, repo.dir, file.path);
        }
      }
  ;

  return (
    <Wrapper className={className}>
      {!file.conflicted && (
        <Action
          onClick={checkoutOrDelete}
          title='Revert changes on this file'
        >
          <Revert />
        </Action>
      )}
      <Action
        onClick={addFile.bind(null, repo.id, repo.dir, file.path)}
        title='Add file to commit'
      >
        <Plus />
      </Action>
    </Wrapper>
  );
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

const FileActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionsComponent as React.SFC);

export default FileActions as React.ComponentClass<IFileActions>;

