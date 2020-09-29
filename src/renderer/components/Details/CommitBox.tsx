import * as React from 'react';
import { connect } from 'react-redux';

import { IRepo } from '../../interfaces/IRepo';
import { commit } from '../../actions/reposActions';
import { lh, g3, resizerWidth } from '../../utils/styles';
import styled from 'styled-components';
import * as Mousetrap from 'mousetrap';

const CommitMessage = styled.textarea`
  width: calc(100% - ${lh}px);
  height: ${lh * 3}px;
  margin: ${lh / 2 - 2}px;
  margin-right: ${lh - 2 + resizerWidth}px;
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
  isBind: boolean = false;
  el: HTMLTextAreaElement;
  key: string;

  constructor(p, c) {
    super(p, c);
    const ctrlKey = process.platform === 'darwin' ? 'command' : 'ctrl';
    this.key = `${ctrlKey}+enter`;
  }

  componentWillUnmount() {
    Mousetrap.unbind(this.key);
  }

  ref(el) {
    if (el && !this.isBind) {
      this.el = el;
      Mousetrap.unbind(this.key);
      Mousetrap(this.el).bind(this.key, () => this.commit());
      this.isBind = true;
    }
  }

  commit() {
    const msg = this.el.value;
    if (msg.length < 2) {
      alert('No commit message or commit to short');
      return;
    }

    if (this.props.repo.lists.staged.length === 0) {
      alert('No files to commit. Add them by clicking "+" from files below');
      return;
    }

    const { id, dir } = this.props.repo;
    this.props.commit(id, dir, msg);
    this.el.value = '';
  }

  render () {
    return (
      <CommitMessage
        ref={this.ref.bind(this)}
        placeholder={`Commit message (press ${this.key}+enter to commit)`}
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

const mapDispatchToProps = {
  commit
};

const CommitBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommitBoxComponent as any);

export default CommitBox as any;
