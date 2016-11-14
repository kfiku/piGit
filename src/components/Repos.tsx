import * as React from 'react';
import { Repo, StateRepo } from './Repo';

let dragula = require('react-dragula');

export interface ReposProps {
  reload: any;
  pull: any;
  delete: any;
  repos: StateRepo[];
}

export class Repos extends React.Component<ReposProps, {}> {
  dragulaDecorator(componentBackingInstance) {
    if (componentBackingInstance) {
      let options = { };
      dragula([componentBackingInstance], options);
    }
  }

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
      <div className='repos columns is-multiline' ref={this.dragulaDecorator}>{reposCollection}</div>
    );
  }
}
