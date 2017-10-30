import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actionsToConnect from '../../actions';
import { lh, g3 } from '../../utils/styles';
import styled from 'styled-components';
import * as Mousetrap from 'mousetrap';

const CommitMessage = styled.textarea`
  width: calc(100% - ${lh * 2}px);
  height: ${lh * 3}px;
  margin: ${lh}px;
  padding: ${lh / 2}px;
  border: 1px solid white;
  resize: none;
  outline: none;

  &:focus {
    border: 1px solid ${g3};
    box-shadow: 0 0 10px ${g3};
  }
`;

interface CommitBoxProps {
  repo: IRepo;
  commit?: any;
}

class CommitBoxComponent extends React.PureComponent<CommitBoxProps> {
  isFocused: boolean = false;
  el: any;
  ctrlKey: string;

  componentWillMount() {
    this.ctrlKey = process.platform === 'darwin' ? 'command' : 'Ctrl';
    Mousetrap.bind(`${this.ctrlKey}+enter`, () => {
      this.commit();

      return false;
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind(`${this.ctrlKey}+enter`);
  }

  commit() {
    const msg = this.el.value;
    if (msg.length < 2) {
      alert('No commit message or commit to short');
      return;
    }

    if (this.props.repo.staged.length === 0) {
      alert('No files to commit. Add them by clicking "+" from files below');
      return;
    }
    const { id, dir } = this.props.repo;
    this.props.commit(id, dir, msg);
    console.log('commit with msg', `"${msg}"`, this.props.repo.dir);
    this.el.value = '';
  }

  render () {
    return (
      <CommitMessage
        innerRef={(el) => { if (el) { this.el = el; } }}
        placeholder={`Commit message (press ${this.ctrlKey}+Enter to commit)`}
        onBlur={() => this.isFocused = true}
        onFocus={() => this.isFocused = true}
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
