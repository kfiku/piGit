import { join } from 'path';
import { StateRepo } from './Repo';

import * as React from 'react';
import * as electron from 'electron';
// import * as glob from 'glob';
import * as async from 'async';

import walk from '../helpers/DirWalk';

export interface NavProps {
  addRepo: any;
  reload: any;
  reloadAll: any;
  repos: StateRepo[];
}

export class Nav extends React.Component <NavProps, {}> {
  isReloadingAll = false;
  isAddingRepo = false;

  reloadAll () {
    this.isReloadingAll = true;
    // this.props.reloadAll();
    this.props.repos.map((repo) => {
      this.props.reload(repo.dir);
    });
  }

  dialog () {
    this.isAddingRepo = true;

    let repos = electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    });

    let reposToAdd = [];

    async.each(repos, (repo, callback) => {
      walk(repo, (err, gitDirs) => {
        if (!err) {
          gitDirs.map((r) => {
            reposToAdd.push(join(r, '..'));
          });

          callback();
        }
      }, '.git', 6);
    }, (err) => {
      if (!err) {
        this.isAddingRepo = false;
        reposToAdd.map(repo => {
          console.log('adding repo', repo);
          this.props.addRepo(repo);
        });
      }
    });
  }

  render() {
    if (this.isReloadingAll) {
      let progressingRepos = this.props.repos.filter(repo => repo.progressing);
      if (progressingRepos.length <= 0) {
        this.isReloadingAll = false;
      }
    }

    let reloadingAll = this.isReloadingAll ? '...' : '';
    let adding = this.isAddingRepo ? '...' : '';

    return (
      <div>
        <nav className='nav main-nav'>
          <div className='nav-left'>
            <span className='nav-item'>
              <button onClick={this.dialog.bind(this)} className='button' >
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                <span>Add Repo</span>
                { adding }
              </button>

              <button onClick={this.reloadAll.bind(this)} className='button' >
                <span className='icon'>
                  <i className='fa fa-refresh'></i>
                </span>
                <span>Reload all</span>
                { reloadingAll }
              </button>
            </span>
          </div>
        </nav>
      </div>
    );
  }
}
