import { stat } from 'fs';
import { join, basename } from 'path';

import { eachSeries } from 'async';
const simpleGit = require('simple-git/promise');

import walk from './DirWalk';
const promisify = require('es6-promisify');

export class Repo {
  updateStatusTI: any;
  git: any;
  state: any;
  gitFetch: any;

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

  async updateStatus () {
    try {
      const status = await this.git.status();
      const stashes = await this.stashList();

      let newState = this.state;
      newState.lastUpdate = Date.now();
      newState.ahead = status.ahead;
      newState.behind = status.behind;

      newState.created = status.created || [];
      newState.modified = status.modified || [];
      newState.deleted = status.deleted || [];
      newState.renamed = status.renamed || [];
      newState.untracked = status.not_added || [];
      newState.stashes = stashes || [];

      newState.files = status.files.map(file => {
        return {
          path: file.path,
          staged: file.index !== ' ' && file.index !== '?',
          type: file.index !== ' ' && file.index !== '?' ? file.index : file.working_dir
        };
      });

      newState.unstaged = newState.files
        .filter(f => !f.staged);

      newState.staged = newState.files
        .filter(f => f.staged);

      newState.branch = status.tracking ? status.tracking.replace('origin/', '') : '-';

      // console.log(newState.stashes);
      this.state = newState;
      return newState;

    } catch (error) {
      return error;
    }
  }

  fetch () {
    return this.git.fetch()
    .then(() => this.updateStatus());
  }

  refresh () {
    return this.git.fetch()
    .then(() => this.updateStatus());
  }

  pull () {
    return this.git.pull(null, null, {'--rebase': 'true'})
    .then(() => this.updateStatus());
  }

  addFile (file: string) {
    return this.git.add([file])
    .then(() => this.updateStatus());
  }

  unAddFile (file: string) {
    return this.git.reset([file])
    .then(() => this.updateStatus());
  }

  checkoutFile (file: string) {
    return this.git.checkout(file)
    .then(() => this.updateStatus());
  }

  remove () {
    this.git = undefined;
    clearTimeout(this.updateStatusTI);
  }

  diff (cb) {
    return this.git.diff(cb);
  }

  stash (msg = '') {
    return this.git.stash(['save', msg || `piGit stash from ${new Date()}`]);
  }

  async stashApplyWithDrop (id: number) {
    const stashKey = `stash@{${id}}`;
    try {
      await this.git.stash(['apply', stashKey]);
      await this.git.stash(['drop', stashKey]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async stashList () {
    const stashes = await this.git.stashList();
    console.log(stashes);
    return stashes && stashes.all;
  }

  push () {
    return this.git.push()
    .then(() => this.updateStatus());
  }

  stashApply () {
    return this.git.stash({ apply: true });
  }

  validateDir (dir, callback) {
    stat(join(dir, '.git'), (err) => {
      callback(err);
    });
  }
}

export class Repos {
  private repos = {};

  searchRepos(dirs: string[],
              steps: (dir: string) => void,
              callback: (err: any, dirs?: string[]) => void) {

    let gitDirsToAdd = [];

    eachSeries(dirs, (dir, cb) => {
      walk(dir, steps, (err, gitDirs) => {
        if (err) {
          console.log(err);
        }
        gitDirsToAdd = gitDirsToAdd.concat(gitDirs);
        cb();
      }, '.git', 6);
    }, () => {
      callback(null, gitDirsToAdd);
    });
  }

  getRepo (dir) {
    return new Promise((resolve, reject) => {
      if (this.repos[dir]) {
        resolve(this.repos[dir]);
      } else {
        this.repos[dir] = new Repo(dir, err => {
          if (err) {
            this.repos[dir] = undefined;
            reject(err);
          } else {
            resolve(this.repos[dir]);
          }
        });
      }
    });
  }

  refresh (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.refresh())
    .then(data => callback(null, data))
    .catch(err => callback(err));
  }

  fetch (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.fetch())
    .then(data => callback(null, data))
    .catch(err => callback(err));
  }

  pull (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.pull())
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
      if (err.indexOf('You have unstaged changes') > -1) {
        this.pullWithStash(dir, callback);
      } else {
        return callback(err);
      }
    });
  }

  addFile (dir: string, file: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.addFile(dir + '/' + file))
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
    });
  }

  unAddFile (dir: string, file: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.unAddFile(dir + '/' + file))
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
    });
  }

  checkoutFile (dir: string, file: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.checkoutFile(dir + '/' + file))
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
    });
  }

  push (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.push())
    .then(data => callback(null, data))
    .catch(err => callback(err));
  }

  async pullWithStash (dir: string, callback) {
    try {
      const repo: Repo = await this.getRepo(dir) as Repo;
      /** getting stash list before stashing */
      const stashes = await repo.stashList();
      /** stashing */
      await repo.stash();
      /** getting new stash list after stashing */
      const newStashes = await repo.stashList();
      /** getting diff between new and old stashes */
      const stashDiff = newStashes
      .filter(newStash => !stashes.find(stash => stash.hash === newStash.hash));

      /** pulling */
      await repo.pull();

      /** applying and droping stashes */
      stashDiff.map(async function(stashToApply, id) {
        console.log('applying and drop stash: ', stashToApply);
        await repo.stashApplyWithDrop(id);
      });

      /** getting new status */
      const status = await repo.updateStatus();

      callback(null, status);
    } catch (e) {
      callback(e);
    }

      // repo.stashList().then((stashes) => {
      //   console.log(stashes);

      //   return repo.stash().then(() =>
      //     repo.pull().then(() =>
      //       repo.stashApply().then(() =>
      //         repo.updateStatus()
      //       )
      //     )
      //   );
      // })
    // )
    // .then(data => callback(null, data))
    // .catch(err => callback(err));
  }

  diff (dir, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.diff(callback));
  }
}

export default new Repos();
