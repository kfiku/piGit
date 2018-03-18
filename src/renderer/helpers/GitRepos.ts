import { stat, unlink } from 'fs';
import { join, basename } from 'path';

import { eachSeries } from 'async';
import { exec } from 'child_process';
import { promisify } from 'es6-promisify';
import * as gitDirsSearch from 'git-dirs-search';
const simpleGit = require('simple-git/promise');

import { IStash, IFile } from '../interfaces/IGit';
import { IRepo } from '../interfaces/IRepo';
import clone from '../helpers/Clone';

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
      id: '',
      progressing: false,
      stats: {
        ahead: 0,
        behind: 0,
        modified: 0,
        deleted: 0,
        renamed: 0,
        untracked: 0,
        conflicted: 0,
        stashes: 0
      },
      lists: {
        staged: [],
        unstaged: [],
        conflicted: [],
        stashes: []
      }
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

      // let newState = clone(this.state);

      const tracking = status.tracking || 'no-tracking';
      const branch = status.current +
        (tracking.indexOf(status.current) === -1 ? ' → ' + tracking : '');

      const files: IFile[] = [];
      status.files.forEach(file => {
        const fileObj: IFile = {
          path: file.path.replace(/.* -> /, ''),
          staged: ['M', 'A', 'R', 'D'].indexOf(file.index) > -1,
          type: file.index !== ' ' && file.index !== '?' ? file.index : file.working_dir,
          conflicted: file.working_dir === 'U'
        };

        if (file.working_dir === 'M' && file.index === 'M') {
          const extraFileObj = clone(fileObj);
          extraFileObj.staged = false;
          files.push(extraFileObj);
        }

        files.push(fileObj);
      });

      const conflicted: IFile[] = files.filter(f => f.conflicted);
      const unstaged: IFile[] = files.filter(f => !f.staged && !f.conflicted);
      const staged: IFile[] = files.filter(f => f.staged);

      const newState: IRepo = {
        id: this.state.id,
        dir: this.state.dir,
        name: this.state.name,
        progressing: this.state.progressing,
        branch,
        stats: {
          ahead: status.ahead,
          behind: status.behind,
          modified: files.filter(f => f.type === 'M').length,
          deleted: files.filter(f => f.type === 'D').length,
          renamed: files.filter(f => f.type === 'R').length,
          untracked: files.filter(f => f.type === '?').length,
          conflicted: files.filter(f => f.type === 'U').length,
          stashes: stashes.length
        },
        lists: {
          staged,
          unstaged,
          conflicted,
          stashes
        }
      };

      if (newState.name === 'piGit') {
        console.log(status, newState);
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
    return this.git.reset(['--', file])
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

  async diff (file: IFile) {
    if (!file) {
      return await this.git.diff();
    } else if (file.staged) {
      return await this.git.diff(['--cached', file.path]);
    }

    return await this.git.diff([file.path]);
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

  async stashList (): Promise<IStash[]> {
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
      gitDirsSearch(dir, (err, gitDirs) => {
        if (err) {
          console.error(err);
        } else {
          gitDirsToAdd = gitDirsToAdd.concat(gitDirs);
        }
        cb();
      }, {
        // forceNode: true,
        maxDepth: 6,
        step: steps,
        ignores: ['node_modules', 'bower_components']
      });
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
      const { stats } = await repo.updateStatus();
      const doRebase = stats.ahead > 0 &&
        this.confirmPullWithRebase(stats.ahead);

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
        !stashes.find(stash => stash.id === newStash.id));

      const { stats } = await repo.updateStatus();
      const doRebase = stats.ahead > 0 &&
                       this.confirmPullWithRebase(stats.ahead);

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
    return confirm(`You are ${ahead} commits ahead. Do you want to pull with rebase?`);
  }

  confirmPullWithStash() {
    return confirm('You have unstaged changes. \n' +
            'Try to stash, pull and apply them, or you do it yourself?');
  }

  async diff(dir: string, file: IFile) {
    try {
      const repo: Repo = await this.getRepo(dir) as Repo;
      const diff: string = await repo.diff(file);
      return diff;
    } catch (e) {
      return e;
    }
  }
}

export default new Repos();
