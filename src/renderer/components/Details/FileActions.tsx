import * as React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import actionsToConnect from '../../actions';
import { IFile } from './File';
import { lh, g5, red } from '../../utils/styles';

const Action = styled.span`
  width: ${lh * 1.25}px;
  height: ${lh * 1.25}px;
  margin-right: ${lh / 4}px;
  color: ${g5};
  text-align: center;
  font-size: ${lh}px;
  font-weight: 700;

  cursor: pointer;

  &:hover {
    color: ${red};
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
        <Action onClick={unAddFile.bind(null, repo.id, repo.dir, file.path)}>‒</Action>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={className}>
      <Action onClick={() => {
        if (confirmCheckout(file.path)) {
           checkoutFile(repo.id, repo.dir, file.path);
        }
      }}>⮌</Action>
      <Action onClick={addFile.bind(null, repo.id, repo.dir, file.path)}>🞡</Action>
    </Wrapper>
  );
}

const mapStateToProps = () => {
  // const repo = state.repos.filter(r => r.id === state.app.repoShown)[0];

  return { };
};

const mapDispatchToProps = dispatch => ({
  addFile: bindActionCreators(actionsToConnect.addFile, dispatch),
  unAddFile: bindActionCreators(actionsToConnect.unAddFile, dispatch)
  checkoutFile: bindActionCreators(actionsToConnect.checkoutFile, dispatch)
});

const FileActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionsComponent as React.SFC);

export default FileActions as React.ComponentClass<IFileActions>;

