import { stat, unlink } from 'fs';
import { join, basename } from 'path';

import { eachSeries } from 'async';
import { exec } from 'child_process';
import { promisify } from 'es6-promisify';
import * as gitDirsSearch from 'git-dirs-search';
const simpleGit = require('simple-git/promise');

import { IStash, IFile } from '../interfaces/IGit';
import { IRepo } from '../interfaces/IRepo';
import gitStatus from '../git/status';

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
      pulling: false,
      stats: {
        ahead: 0,
        added: 0,
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
        this.updateStatus()
          .then(() => callback(null))
          .catch(err2 => callback(err2));
        // callback(null);
      } else {
        callback(err);
      }
    });
  }

  async updateStatus (): Promise<IRepo> {
    try {
      const newStatus = await gitStatus(this.state.dir);
      const newState: IRepo = {
        ...newStatus,
        dir: this.state.dir,
        name: this.state.name,
        id: this.state.id,
        progressing: this.state.progressing,
        pulling: this.state.pulling,
      };
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
  addAllFiles () {
    return this.git.add(['-A'])
    .then(() => this.updateStatus());
  }

  unAddFile (file: string) {
    return this.git.reset(['--', file])
    .then(() => this.updateStatus());
  }
  unAddAllFiles () {
    return this.git.reset(['--', '.'])
    .then(() => this.updateStatus());
  }

  checkoutFile (file: string) {
    return this.git.checkout(file)
    .then(() => this.updateStatus());
  }

  checkoutAllFiles () {
    return this.git.checkout(['--', '.'])
    .then(() => this.git.clean('f', ['-d']))
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

  searchRepos(
    dirs: string[],
    steps: (dir: string) => void,
    callback: (err: any, dirs?: string[]) => void
  ) {
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
      const status = await repo.updateStatus();
      const { stats } = status;
      const isBehind = stats.behind > 0;
      if (!isBehind) {
        /** nothing behind, no need to pull */
        return callback(null, status);
      }

      const isAhead = stats.ahead > 0;
      const isModified = stats.modified > 0 || stats.deleted > 0 || stats.deleted;

      if (isAhead && isModified) {
        const stashPullRebase = confirm(`
          This repo is ${stats.ahead} commits ahead and has moditications.
          Do you wan't automatic pull with rebase?
          (stash, pull rebase, apply stash)
        `);

        if (stashPullRebase) {
          return this.pullWithStash(dir, true, callback);
        } else {
          const pullWithMerge = confirm(`So you won't pull with merge?`);
          if (!pullWithMerge) {
            return callback(null, status);
          }
        }
      } else if (isAhead) {
        const doRebase = confirm(`
          This repo is ${stats.ahead} commits ahead.
          Do you want to pull with rebase?
        `);

        if (doRebase) {
          // pull with rebase
          console.info('pull with rebase');
          const stateAfterRebase = await repo.pullWithRebase();
          return callback(null, stateAfterRebase);
        } else {
          const pullWithMerge = confirm(`So you won't pull with merge?`);
          if (!pullWithMerge) {
            return callback(null, status);
          }
        }
      }

      console.info('regular pull');
      const statusAfterPull = await repo.pull();
      return callback(null, statusAfterPull);

    } catch (err) {
      return callback(err);
    }
  }

  async pullWithStash(dir: string, doRebase: boolean, callback) {
    try {
      const repo: Repo = await this.getRepo(dir);
      const stashes = await repo.stashList();
      await repo.stash();
      const newStashes = await repo.stashList();
      /** getting diff between new and old stashes */
      const stashDiff = newStashes.filter(newStash =>
        !stashes.find(stash => stash.id === newStash.id));

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
      const promises = stashDiff.map(async function(stashToApply) {
        console.log('applying and drop stash: ', stashToApply, stashToApply.id);
        return await repo.stashApplyWithDrop(stashToApply.id);
      });
      /** waiting until all stash drop finished */
      await Promise.all(promises);

      /** getting new status */
      const newStatus = await repo.updateStatus();
      callback(null, newStatus);
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
  addAllFiles (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.addAllFiles())
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
  unAddAllFiles (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.unAddAllFiles())
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

  checkoutAllFiles (dir: string, callback) {
    this.getRepo(dir)
    .then((repo: Repo) => repo.checkoutAllFiles())
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
      const newStatus = await repo.updateStatus();
      callback(null, newStatus);
    } catch (e) {
      callback(e);
    }
  }

  async stashDrop (dir: string, stashKey: string, callback) {
    try {
      const repo: Repo = await this.getRepo(dir) as Repo;
      await repo.stashDrop(stashKey);
      /** getting new status */
      const newStatus = await repo.updateStatus();
      callback(null, newStatus);
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
