import { stat } from "fs";
import { join, basename } from "path";
import { EventEmitter } from "events";

import * as electron from 'electron';
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as async from "async";

import { Hello } from "./components/Hello";
import { Nav } from "./components/Nav";
import { Repo } from "./components/Repo";

var electronSettings = require('electron-settings');
var SimpleGit = require('simple-git');

class RepoModel extends EventEmitter {
  updateStatusTI: any;
  git: any;
  name: string;
  branch: string;

  ahade: number;
  behind: number;

  modified: string[];
  created: string[];

  constructor (public dir: string, callback) {
    super();

    this.validateDir(dir, (err) => {
      if(err) {
        callback(err);
      } else {
        this.git = SimpleGit(dir);
        this.name = basename(dir);

        this.updateStatus();
        callback(null, true);
      }
    });
  }

  updateStatus () {
    this.git.status((err, status) => {
      if(!err) {
        console.log(status);
        this.modified = status.modified;
        this.created = status.created;
        this.ahade = status.ahade;
        this.behind = status.behind;
        this.branch = status.tracking.replace('origin/', '');
        this.emit('change');
        this.updateStatusTI = setTimeout(this.updateStatus.bind(this), 60*60*1000); // 1min;
      }
    });
  }

  remove () {
    this.git = undefined;
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
    })
  }

  inform () {
    this.emit('change');
  }

  dialog () {
    let repos = electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    });

    this.add(repos);
  }

  add (dirs, callback?) {
    if (typeof dirs === 'string') {
      dirs = [dirs];
    }

    dirs = dirs.filter((d, i) => dirs.lastIndexOf(d) === i && this.reposStr.indexOf(d) === -1);

    async.each(dirs, (dir: string, cb) => {
      const repo = new RepoModel(dir, (err) => {
        if (!err) {
          repo.on('change', this.inform.bind(this));
          repo.on('remove', this.remove.bind(this, repo.dir));
          this.repos.push(repo);
        }
        cb();
      });
    }, (err) => {
      if (!err) {
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

export interface AppProps { model }

class GitWatchApp extends React.Component <AppProps, {}> {
  render() {
    let reposCollection = [];
    let repos = this.props.model.repos;

    if (repos) {
      reposCollection = repos.map((repoModel) => {
        return (
          <Repo
            key={repoModel.dir}
            name={repoModel.name}
            branch={repoModel.branch}

            ahade={repoModel.ahade}
            behind={repoModel.behind}

            added={repoModel.added}
            modified={repoModel.modified}
            onDelete={repoModel.remove.bind(repoModel, repoModel.dir) }
          />
        );
      });
    }

    return (
      <div>
        <Nav dialog={this.props.model.dialog.bind(this.props.model)}/>
        <section className="section">
          <div className="tile is-ancestor is-multiline">
            {reposCollection}
          </div>
        </section>
      </div>
    );
  }
}



let repos = new Repos();

function render () {
  ReactDOM.render(
    <GitWatchApp model={repos}/>,
    document.getElementById("example")
  );
}

repos.on('change', render);
render();
