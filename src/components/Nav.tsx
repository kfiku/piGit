import { join } from 'path';

import * as React from 'react';
import * as electron from 'electron';
import * as glob from 'glob';
import * as async from 'async';

export interface NavProps { addRepo: any, reloadAll: any; }

export class Nav extends React.Component <NavProps, {}> {
  dialog () {
    let repos = electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    });
    let reposToAdd = [];
    
    async.each(repos, (repo, callback) => {
      glob(repo + '/**/.git', (err, gitDirs: string[]) => {
        gitDirs.map((r) => {
          reposToAdd.push(join(r, '..'));
        });

        callback();
      });
    }, (err) => {
      if (!err) {
        reposToAdd.map(repo => {
          this.props.addRepo(repo);
        });
      }
    });
  }

  render() {
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
              </button>

              <button onClick={this.props.reloadAll} className='button' >
                <span className='icon'>
                  <i className='fa fa-refresh'></i>
                </span>
                <span>Reload all</span>
              </button>
            </span>
          </div>
        </nav>
      </div>
    );
  }
}
