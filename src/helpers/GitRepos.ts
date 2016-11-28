import { stat } from 'fs';
import { join, basename } from 'path';

import { eachSeries } from 'async';
const simpleGit = require('simple-git');

import walk from './DirWalk';


export class Repo {
  updateStatusTI: any;
  git: any;
  state: any;

  constructor (dir, callback) {
    this.state = {
      dir: dir,
      name: basename(dir),
      branch: '',
      ahead: 0,
      behind: 0,
      modified: [],
      added: []
    };

    this.validateDir(dir, (err) => {
      if (!err) {
        this.git = simpleGit(dir);
        callback(null);
      } else {
        callback(err);
      }
    });
  }

  updateStatus (callback, params: { remoteHeads?: string[] } = undefined) {
    this.git.status((err, status) => {
      if (!err) {
        let newState = this.state;

        newState.lastUpdate = Date.now();
        newState.modified = status.modified;
        newState.ahead = status.ahead;
        newState.behind = status.behind;
        newState.branch = status.tracking ? status.tracking.replace('origin/', '') : '-';

        this.state = newState;

        callback(null, newState);

        // clearTimeout(this.updateStatusTI);
        // this.updateStatusTI = setTimeout(this.fetch.bind(this), 60 * 60 * 1000); // 1min;
      } else {
        callback(err);
      }
    });
  }

  fetch (callback) {
    this.git.fetch((err) => {
       if (err) {
          // TODO: make it pretty :)
          alert(err);
          callback(err);
        } else {
          this.updateStatus(callback);
        }
    });
  }

  refresh (callback) {
    // this.git.listRemote(['--heads'], (err, remoteHeads) => {
    //   console.log(err, remoteHeads);
    //   this.updateStatus(callback, { remoteHeads });
    // })
    this.git.fetch((err) => {
       if (err) {
          // TODO: make it pretty :)
          alert(err);
          callback(err);
        } else {
          this.updateStatus(callback);
        }
    });
  }

  pull (callback) {
    this.git.pull((err) => {
      if (err) {
        // TODO: make it pretty :)
        alert(err);
        callback(err);
      } else {
        this.updateStatus(callback);
      }
    });
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
};

export class Repos {
  private repos = {};

  searchRepos(dirs: string[],
              steps: (dir: string) => void,
              callback: (err: any, dirs?: string[]) => void) {

    let gitDirsToAdd = [];

    eachSeries(dirs, (dir, cb) => {
      walk(dir, steps, (err, gitDirs) => {
        gitDirsToAdd = gitDirsToAdd.concat(gitDirs);
        cb();
      }, '.git', 6);
    }, () => {
      callback(null, gitDirsToAdd);
    });
  }

  refresh (dir: string, callback) {
    if (!this.repos[dir]) {
      this.repos[dir] = new Repo(dir, (err) => {
        this.refresh(dir, callback);
      });
    } else {
      this.repos[dir].refresh((err, data) => {
        callback(err, data);
      });
    }
  }

  fetch (dir: string, callback) {
    if (!this.repos[dir]) {
      this.repos[dir] = new Repo(dir, (err) => {
        this.fetch(dir, callback);
      });
    } else {
      this.repos[dir].fetch((err, data) => {
        callback(err, data);
      });
    }
  }

  pull (dir: string, callback) {
    if (!this.repos[dir]) {
      this.repos[dir] = new Repo(dir, (err) => {
        this.pull(dir, callback);
      });
    } else {
      this.repos[dir].pull((err, data) => {
        callback(err, data);
      });
    }
  }
};

export default new Repos();
