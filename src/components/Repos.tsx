import * as React from 'react';
import { Repo, StateRepo } from './Repo';

let Sortable = require('sortablejs');

export interface ReposProps {
  reload: any;
  pull: any;
  delete: any;
  reorder: any;
  repos: StateRepo[];
}

export class Repos extends React.Component<ReposProps, {}> {
  sortable(el) {
    if (el) {
      let options = {
        animation: 200,
        group: 'repos',
        handle: '.title',
        forceFallback: true,
        onUpdate: (event) => {
          this.props.reorder(event.oldIndex, event.newIndex);
        }
      };

      let sortablejs = new Sortable(el, options);
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
      <div className='repos-box'>
        {/*
        <div className='g1' ref={this.sortable.bind(this)}>
          <h3>g1</h3>
        </div>
        <div className='g2' ref={this.sortable.bind(this)}>
          <h3>g2</h3>
        </div>
        <div className='g3' ref={this.sortable.bind(this)}>
          <h3>g3</h3>
        </div>
        */}
        <div className='g4 repos columns is-multiline' ref={this.sortable.bind(this)}>{reposCollection}</div>
      </div>
    );
  }
}
