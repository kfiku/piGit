import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import actionsToConnect from '../../actions';
import { lh } from '../../utils/styles';
import styled from 'styled-components';

const CommitMessage = styled.textarea`
  width: calc(100% - ${lh * 2}px);
  height: ${lh * 3}px;
  margin: ${lh}px;
  border: none;
  resize: none;
`;

interface CommitBoxProps {
  repo: IRepo;
  commit?: any;
}

class CommitBoxComponent extends React.PureComponent<CommitBoxProps> {
  onKeyPress(e) {
    if (e.keyCode === 13 && e.ctrlKey) {
      const msg = e.target.value;
      if (msg.length < 2) {
        alert('No commit message or commit to short');
        return;
      }

      if (this.props.repo.staged.length === 0) {
        alert('No files to commit');
        return;
      }
      const { id, dir } = this.props.repo;
      this.props.commit(id, dir, msg);
      console.log('commit with msg', `"${msg}"`, this.props.repo.dir);
      e.target.value = '';
    }
  }

  render () {
    return (
      <CommitMessage
        placeholder='Commit message (press Ctrl+Enter to commit)'
        onKeyUp={this.onKeyPress.bind(this)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const repo = state.repos.filter(r => r.id === state.app.repoShown)[0];

  return { repo };
};

const mapDispatchToProps = dispatch => ({
  commit: bindActionCreators(actionsToConnect.commit, dispatch)
});

const CommitBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommitBoxComponent as any);

export default CommitBox as any;
