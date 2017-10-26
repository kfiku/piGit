import * as React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import { lh, fileHeight, g5, red } from '../../utils/styles';
import actionsToConnect from '../../actions';
import Revert from '../Icons/Revert';
const Plus = require('react-icons/lib/fa/plus');
const Minus = require('react-icons/lib/fa/minus');
import { IFile } from './File';

export const Action = styled.span`
  display: inline-block;
  width: ${fileHeight}px;
  height: ${fileHeight}px;
  text-align: center;
  font-size: ${lh}px;
  font-weight: 700;

  svg {
    fill: ${g5};
    width: ${fileHeight * 0.75}px;
    height: ${fileHeight * 0.75}px;
  }

  cursor: pointer;

  &:hover {
    svg {
      fill: ${red};
    }
  }
`;

export const Wrapper = styled.div`
  display: none;
`;

function confirmCheckout (file) {
  return confirm(`Are you sure you want to discard changes in ${file}`);
}

interface IFileActions {
  file: IFile;
  className: string;
  repo: IRepo;
  addFile?: any;
  unAddFile?: any;
  checkoutFile?: any;
}

export function FileActionsComponent ({
  file, className, repo, addFile, unAddFile, checkoutFile
}: IFileActions) {
  if (file.staged) {
    return (
      <Wrapper className={className}>
        <Action
          onClick={unAddFile.bind(null, repo.id, repo.dir, file.path)}
          title='Revert changes on this file'
        >
          <Minus height={lh * 0.75} width={lh * 0.75} />
        </Action>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={className}>
      <Action
        onClick={() => {
          if (confirmCheckout(file.path)) {
            checkoutFile(repo.id, repo.dir, file.path);
          }
        }}
        title='Revert changes on this file'
      >
        <Revert />
      </Action>
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
  checkoutFile: bindActionCreators(actionsToConnect.checkoutFile, dispatch)
});

const FileActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionsComponent as React.SFC);

export default FileActions as React.ComponentClass<IFileActions>;

