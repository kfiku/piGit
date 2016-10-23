import * as React from 'react';

import { stat } from 'fs';
import { join, basename } from 'path';

const simpleGit = require('simple-git');

export interface RepoProps {
  repo: {id: number, dir: string };
  onDelete?: () => any;
  onRefresh?: () => any;
  onPull?: () => any;
}

export interface RepoState {
  name: string;
  branch: string;
  ahead: number;
  behind: number;
  progressing: boolean;
  modified: string[];
  added: string[];
}

export class Repo extends React.Component<RepoProps, RepoState> {
  updateStatusTI: any;
  git: any;

  constructor (props) {
    super(props);

    let { repo } = props;

    this.state = {
      name: basename(repo.dir),
      branch: '',
      ahead: 0,
      behind: 0,
      progressing: true,
      modified: [],
      added: []
    }

    this.validateDir(repo.dir, (err) => {
      if (!err) {
        this.git = simpleGit(repo.dir);

        this.updateStatus();
        this.fetch();
      }
    });
  }

  startProgressing () {
    this.setState( Object.assign(this.state, { progressing: true }) );
  }

  stopProgressing () {
    this.setState( Object.assign(this.state, { progressing: false }) );
  }

  updateStatus () {
    this.git.status((err, status) => {
      this.stopProgressing();
      if (!err) {
        let newState = this.state;

        newState.modified = status.modified,
        newState.ahead = status.ahead,
        newState.behind = status.behind,
        newState.branch = status.tracking.replace('origin/', ''),

        this.setState(newState);

        clearTimeout(this.updateStatusTI);
        this.updateStatusTI = setTimeout(this.fetch.bind(this), 60 * 60 * 1000); // 1min;
      }
    });
  }

  refresh () {
    this.fetch();
  }

  fetch () {
    this.startProgressing();
    this.git.fetch(this.updateStatus.bind(this));
  }

  pull () {
    this.startProgressing();
    this.git.pull(this.updateStatus.bind(this));
  }

  remove () {
    this.git = undefined;
    clearTimeout(this.updateStatusTI);
  }


  validateDir (dir, callback) {
    stat(join(dir, '.git'), (err, rStat) => {
      callback(err);
    });
  }

  render() {
    let modifiedBox;
    if (this.state.modified && this.state.modified.length) {
      let modifiedNodes = this.state.modified.map(mod => (
        <li key={mod}>{mod}</li>
      ));

      modifiedBox = (
        <div>
          modified: {this.state.modified.length}
          <ul>
            {modifiedNodes}
          </ul>
        </div>
      );
    }

    let addedBox;
    if (this.state.added && this.state.added.length) {
      let addedNodes = this.state.added.map(mod => (
        <li key={mod}>{mod}</li>
      ));

      addedBox = (
        <div>z
          added: {this.state.added.length}
          <ul>
            {addedNodes}
          </ul>
        </div>
      );
    }

    let progressing;
    if (this.state.progressing) {
      progressing = <button className='button is-small is-info is-loading'>Loading</button>;
    }

    return (
      <div className='column is-4'>
        <div className='notification is-info'>
          <button onClick={ this.state.onDelete } className='delete'></button>

          <header>
            <span className='title is-5'>{this.state.name + ' '}</span>
            <small className=''>@ {this.state.branch}</small>
          </header>

          <nav>
            <button className='button is-small is-warning' onClick={ this.refresh.bind(this) }>
              <span className='icon is-small'>
                <i className='fa fa-refresh'></i>
              </span>
              <span>refresh</span>
            </button>
            <button className='button is-small is-success' onClick={ this.pull.bind(this) }>
              <span className='icon is-small'>
                <i className='fa fa-arrow-down'></i>
              </span>
              <span>pull</span>
            </button>
            { progressing }
          </nav>

          { this.state.ahead ? 'ahead: ' + this.state.ahead : '' }
          { this.state.behind ? 'behind: ' + this.state.behind : '' }
          { modifiedBox }
          { addedBox }
        </div>
      </div>
    );
  }
}
