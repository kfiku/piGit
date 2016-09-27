import { stat } from 'fs';
import { join, basename } from 'path';
import { EventEmitter } from 'events';

import * as electron from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as async from 'async';

import { Nav } from './components/Nav';
import { Repo } from './components/Repo';

const electronSettings = require('electron-settings');
const simpleGit = require('simple-git');
const glob = require('glob');

class RepoModel extends EventEmitter {
  updateStatusTI: any;
  git: any;
  name: string;
  branch: string;
  progressing = false;

  ahead: number;
  behind: number;

  modified: string[];
  created: string[];

  constructor (public dir: string, callback) {
    super();

    this.validateDir(dir, (err) => {
      if (err) {
        callback(err);
      } else {
        this.git = simpleGit(dir);
        this.name = basename(dir);

        this.updateStatus();
        this.fetch();
        callback(null, true);
      }
    });
  }

  updateStatus () {
    this.git.status((err, status) => {
      this.progressing = false;
      if (!err) {
        this.modified = status.modified;
        this.created = status.created;
        this.ahead = status.ahead;
        this.behind = status.behind;
        this.branch = status.tracking.replace('origin/', '');
        this.emit('change');

        clearTimeout(this.updateStatusTI);
        this.updateStatusTI = setTimeout(this.fetch.bind(this), 60 * 60 * 1000); // 1min;
      }
    });
  }

  fetch () {
    this.emit('change');
    this.progressing = true;
    this.git.fetch(this.updateStatus.bind(this));
  }

  pull () {
    this.emit('change');
    this.progressing = true;
    this.git.pull(this.updateStatus.bind(this));
  }

  remove () {
    this.git = undefined;
    clearTimeout(this.updateStatusTI);
    this.emit('remove');
  }

  validateDir (dir, callback) {
    stat(join(dir, '.git'), (err, rStat) => {
      callback(err);
    });
  }
}

class Repos extends EventEmitter {
  repos: RepoModel[] = [];
  reposStr: string[] = [];

  constructor () {
    super();

    electronSettings.get('repos').then((rps: string[]) => {
      this.add(rps, (err) => {
        this.inform();
      });
    });
  }

  inform () {
    this.emit('change');
  }

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
      this.add(reposToAdd);
    });
  }

  add (dirs, callback?) {
    if (typeof dirs === 'string') {
      dirs = [dirs];
    }

    dirs = dirs.filter((d, i) => dirs.lastIndexOf(d) === i && this.reposStr.indexOf(d) === -1);

    async.each(dirs, (dir: string, cb) => {
      let id = this.repos.length;
      const repo = new RepoModel(dir, (err) => {
        if (!err) {
          repo.on('change', this.inform.bind(this));
          repo.on('remove', this.remove.bind(this, repo.dir));
        } else {
          this.repos[id] = undefined;
        }
        cb();
      });
      this.repos[id] = repo;
    }, (err) => {
      if (!err) {
        this.repos = this.repos.filter(r => !!r);
        this.inform();
        this.save();
      }
    });
  }

  remove (dir) {
    this.repos = this.repos.filter(r => {
      return r.dir !== dir;
    });

    this.inform();
    this.save();
  }

  save () {
    this.reposStr = this.repos.map(r => r.dir);
    electronSettings.set('repos', this.reposStr);
  }
}

export interface AppProps { model; }

class GitWatchApp extends React.Component <AppProps, {}> {
  render() {
    let reposCollection = [];
    let repos = this.props.model.repos;

    if (repos) {
      reposCollection = repos.map((repoModel) => {
        return  (
          <Repo
            key={repoModel.dir}
            name={repoModel.name}
            branch={repoModel.branch}
            progressing={repoModel.progressing}

            ahead={repoModel.ahead}
            behind={repoModel.behind}

            added={repoModel.added}
            modified={repoModel.modified}
            onDelete={repoModel.remove.bind(repoModel, repoModel.dir)}
            onRefresh={repoModel.fetch.bind(repoModel)}
            onPull={repoModel.pull.bind(repoModel)}
          />
        );
      });
    }

    return (
      <div>
        <Nav dialog={this.props.model.dialog.bind(this.props.model)}/>
        <section className='section'>
          <div className='columns is-multiline'>
            {reposCollection}
          </div>
        </section>
      </div>
    );
  }
}



let repos = new Repos();

const render = () => {
  ReactDOM.render(
    <GitWatchApp model={repos}/>,
    document.getElementById('example')
  );
};

repos.on('change', render);
render();
