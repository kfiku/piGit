import * as React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import { lh, g5, red } from '../../utils/styles';
import actionsToConnect from '../../actions';
import Revert from '../Icons/Revert';
const Plus = require('react-icons/lib/fa/plus');
const Minus = require('react-icons/lib/fa/minus');
import { IFile } from './File';

const Action = styled.span`
  display: inline-block;
  width: ${lh * 1.25}px;
  height: ${lh * 1.25}px;
  // margin-right: ${lh / 4}px;
  text-align: center;
  font-size: ${lh}px;
  font-weight: 700;

  svg {
    fill: ${g5};
  }

  cursor: pointer;

  &:hover {
    svg {
      fill: ${red};
    }
  }
`;

const Wrapper = styled.div`
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
        <Action onClick={unAddFile.bind(null, repo.id, repo.dir, file.path)}>
          <Minus height={lh * 0.75} width={lh * 0.75} />
        </Action>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={className}>
      <Action onClick={() => {
        if (confirmCheckout(file.path)) {
           checkoutFile(repo.id, repo.dir, file.path);
        }
      }}>
        <Revert height={lh * 0.75} width={lh * 0.75} />
      </Action>
      <Action onClick={addFile.bind(null, repo.id, repo.dir, file.path)}>
        <Plus height={lh * 0.75} width={lh * 0.75} />
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

