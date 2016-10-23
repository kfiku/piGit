import * as React from 'react';

import { stat } from 'fs';
import { join, basename } from 'path';
import * as electron from 'electron';
import * as glob from 'glob';

import { Repo } from './Repo';

export interface ReposProps {
  repos: {id: number, dir: string}[];
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
          />
        );
      });
    }

    return (
      <div>{reposCollection}</div>
    );
  }
}
