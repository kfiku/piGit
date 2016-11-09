import * as React from 'react';

import { stat } from 'fs';
import { join, basename } from 'path';
import * as electron from 'electron';
import * as glob from 'glob';

import { Repo, StateRepo } from './Repo';

export interface ReposProps {
  reload: any;
  pull: any;
  delete: any;
  repos: StateRepo[];
}

export class Repos extends React.Component<ReposProps, {}> {
  render() {
    let reposCollection;
    if (this.props.repos) {
      reposCollection = this.props.repos.map((repo) => {
        return (
          <Repo
            key={repo.dir}
            repo={repo}
            onRefresh={this.props.reload}
            onDelete={this.props.delete}
            onPull={this.props.pull}
          />
        );
      });
    }

    return (
      <div className='repos columns is-multiline'>{reposCollection}</div>
    );
  }
}
