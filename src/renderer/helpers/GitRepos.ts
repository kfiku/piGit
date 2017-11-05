import { stat, unlink } from 'fs';
import { join, basename } from 'path';

import { eachSeries } from 'async';
import { exec } from 'child_process';
import * as promisify from 'es6-promisify';
const simpleGit = require('simple-git/promise');

import walk from './DirWalk';
import { IStash } from '../components/Details/Stash';
import { IRepo } from '../interfaces/IRepo';

const execPromise = promisify(exec);
const unlinkPromise = promisify(unlink);

export class Repo {
  updateStatusTI: any;
  git: any;
  state: IRepo;
  gitFetch: any;

  constructor (dir, callback) {
    this.state = {
      dir: dir,
      name: basename(dir),
      branch: '',
      ahead: 0,
      behind: 0,
      modified: [],
      staged: [],
      deleted: [],
      renamed: [],
      untracked: [],
      conflicted: [],
      unstaged: [],
      stashes: []
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

  async updateStatus (): Promise<IRepo> {
    try {
      const status = await this.git.status();
      const stashes = await this.stashList();

      let newState = this.state;
      // newState.lastUpdate = Date.now();
      newState.ahead = status.ahead;
      newState.behind = status.behind;
      newState.modified = status.modified || [];
      newState.deleted = status.deleted || [];
      newState.renamed = status.renamed || [];
      newState.untracked = status.not_added || [];
      newState.stashes = stashes || [];

      const extraFiles = [];
      let files = status.files.map(file => {
        if (file.working_dir === 'M' && file.index === 'M') {
          extraFiles.push({
            path: file.path,
            staged: false,
            type: file.index
          });
        }
        return {
          path: file.path,
          staged: ['M', 'A', 'R'].indexOf(file.index) > -1,
          type: file.index !== ' ' && file.index !== '?' ? file.index : file.working_dir
        };
      });

      if (extraFiles.length) {
        files = [...files, ...extraFiles];
      }

      if (status.conflicted.length) {
        newState.conflicted = status.conflicted.map(file => ({
          path: file,
          staged: false,
          type: 'U'
        }));
      }

      newState.unstaged = files
        .filter(f => !f.staged && f.type !== 'U');

      newState.staged = files
        .filter(f => f.staged);

      newState.branch = status.tracking ? status.tracking.replace('origin/', '') : '-';

      if (newState.name === 'piGit') {
        // console.log(status, newState);
      }

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
    return this.git.pull()
    .then(() => this.updateStatus());
  }

  pullWithRebase () {
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

  deleteFile (file: string) {
    return unlinkPromise(file)
    .then(() => this.updateStatus());
  }

  commit (msg: string) {
    return this.git.commit(msg)
    .then(() => this.updateStatus());
  }

  remove () {
    this.git = undefined;
    clearTimeout(this.updateStatusTI);
  }

  async diff () {
    return await this.git.diff();
  }

  stash (msg = '') {
    return this.git.stash(['save', msg || `piGit stash from ${new Date()}`]);
  }

  async stashApply (stashKey: string) {
    try {
      await this.git.stash(['apply', stashKey]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async stashDrop (stashKey: string) {
    try {
      await this.git.stash(['drop', stashKey]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async stashApplyWithDrop (stashKey: string) {
    try {
      await this.stashApply(stashKey);
      await this.stashDrop(stashKey);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async stashList () {
    try {
      const stashes2 = await execPromise(
        `cd ${this.state.dir} && git stash list --pretty=format:%gd__%ai__%s`
      );
      const stashesList = stashes2
      .split('\n')
      .filter(s => s)
      .map(s => {
        const stashArr = s.split('__');
        const stash: IStash = {
          id: stashArr[0],
          date: stashArr[1],
          message: stashArr[2]
        };

        return stash;
      });

      return stashesList;
    } catch (error) {
      console.log(error);
    }

    const stashes = await this.git.stashList();
    return stashes && stashes.all.map((stash, id) => {
      stash.id = id;
      return stash;
    });
  }

  push () {
    return this.git.push()
    .then(() => this.updateStatus());
  }

  validateDir (dir, callback) {
    stat(join(dir, '.git'), (err) => {
      callback(err);
    });
  }
}

export class Repos {
  private repos: { [key: string]: Repo } = {};

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

  getRepo (dir): Promise<Repo> {
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

  updateStatus (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.updateStatus())
    .then(data => callback(null, data))
    .catch(err => callback(err));
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

  async pull (dir: string, callback) {
    try {
      const repo = await this.getRepo(dir);
      const { ahead } = await repo.updateStatus();
      const doRebase = ahead > 0 &&
                       this.confirmPullWithRebase(ahead);

      if (doRebase) {
        // pull with rebase
        console.info('pull with rebase');
        const newStatus = await repo.pullWithRebase();
        return callback(null, newStatus);
      } else {
        // Regular pull
        console.info('regular pull');
        const newStatus = await repo.pull();
        return callback(null, newStatus);
      }
    } catch (err) {
      const errMsg = err.message || err + '';
      if (errMsg.indexOf('You have unstaged changes') > -1 &&
      this.confirmPullWithStash()) {
        this.pullWithStash(dir, callback);
      } else if (errMsg.indexOf('Please commit your changes or stash them') > -1 &&
      this.confirmPullWithStash()) {
        this.pullWithStash(dir, callback);
      } else {
        return callback(err);
      }
    }
  }

  async pullWithStash (dir: string, callback) {
    try {
      const repo: Repo = await this.getRepo(dir);
      const stashes = await repo.stashList();
      await repo.stash();
      const newStashes = await repo.stashList();
      /** getting diff between new and old stashes */
      const stashDiff = newStashes.filter(newStash =>
        !stashes.find(stash => stash.hash === newStash.hash));

      const { ahead } = await repo.updateStatus();
      const doRebase = ahead > 0 &&
                       this.confirmPullWithRebase(ahead);

      if (doRebase) {
        // pull with rebase
        console.info('pull with rebase');
        await repo.pullWithRebase();
      } else {
        // Regular pull
        console.info('regular pull');
        await repo.pull();
      }

      /** applying and dropping stashes */
      stashDiff.map(async function(stashToApply) {
        console.log('applying and drop stash: ', stashToApply, stashToApply.id);
        await repo.stashApplyWithDrop(stashToApply.id);
      });

      /** getting new status */
      const status = await repo.updateStatus();
      callback(null, status);
    } catch (e) {
      callback(e);
    }
  }

  addFile (dir: string, file: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.addFile(dir + '/' + file))
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
      callback(err);
    });
  }

  unAddFile (dir: string, file: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.unAddFile(dir + '/' + file))
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
      callback(err);
    });
  }

  checkoutFile (dir: string, file: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.checkoutFile(dir + '/' + file))
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
      callback(err);
    });
  }

  deleteFile (dir: string, file: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.deleteFile(dir + '/' + file))
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
      callback(err);
    });
  }

  commit (dir: string, msg: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.commit(msg))
    .then(data => callback(null, data))
    .catch(err => {
      console.log(err);
      callback(err);
    });
  }

  async stashApplyWithDrop (dir: string, stashKey: string, callback) {
    try {
      const repo: Repo = await this.getRepo(dir) as Repo;
      await repo.stashApply(stashKey);
      await repo.stashDrop(stashKey);
      /** getting new status */
      const status = await repo.updateStatus();
      callback(null, status);
    } catch (e) {
      callback(e);
    }
  }

  async stashDrop (dir: string, stashKey: string, callback) {
    try {
      const repo: Repo = await this.getRepo(dir) as Repo;
      await repo.stashDrop(stashKey);
      /** getting new status */
      const status = await repo.updateStatus();
      callback(null, status);
    } catch (e) {
      callback(e);
    }
  }

  push (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.push())
    .then(data => callback(null, data))
    .catch(err => callback(err));
  }

  confirmPullWithRebase(ahead) {
    return confirm(`You are ${ahead} commits ahead. Do you want to pull with rebase?`)
  }

  confirmPullWithStash() {
    return confirm('You have unstaged changes. \n' +
            'Try to stash, pull and apply them, or you do it yourself?');
  }

  async diff (dir) {
    try {
      const repo: Repo = await this.getRepo(dir) as Repo;
      const diff: string = await repo.diff();
      return diff;
    } catch (e) {
      return e;
    }
  }
}

export default new Repos();
