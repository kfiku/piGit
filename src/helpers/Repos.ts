import { stat } from 'fs';
import { join, basename } from 'path';

const simpleGit = require('simple-git');

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

  updateStatus (callback) {
    this.git.status((err, status) => {
      if (!err) {
        let newState = this.state;

        newState.modified = status.modified;
        newState.ahead = status.ahead;
        newState.behind = status.behind;
        newState.branch = status.tracking.replace('origin/', '');

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
    this.git.fetch(this.updateStatus.bind(this, callback));
  }

  pull (callback) {
    this.git.pull(this.updateStatus.bind(this, callback));
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
