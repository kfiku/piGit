import * as React from 'react';
import * as moment from 'moment';

export interface StateRepo {
  id: number;
  name: string;
  branch: string;
  dir: string;
  ahead: number;
  behind: number;
  modified: any[];
  added: any[];
  progressing?: boolean;
  lastUpdate?: number;
}

export interface RepoProps {
  repo: StateRepo;
  onDelete?: () => any;
  onRefresh?: () => any;
  onPull?: () => any;
}

export class Repo extends React.Component<RepoProps, {}> {
  constructor(props) {
    super(props);

    if (!this.props.repo.branch) {
      setTimeout(() => { props.onRefresh(props.repo.dir); }, 200);
    }
  }

  render() {
    let modifiedBox;
    if (this.props.repo.modified && this.props.repo.modified.length) {
      let modifiedNodes = this.props.repo.modified.map(mod => (
        <li key={mod}>{mod}</li>
      ));

      modifiedBox = (
        <div>
          Modified: {this.props.repo.modified.length}
          <ul>
            {modifiedNodes}
          </ul>
        </div>
      );
    }

    let addedBox;
    if (this.props.repo.added && this.props.repo.added.length) {
      let addedNodes = this.props.repo.added.map(mod => (
        <li key={mod}>{mod}</li>
      ));

      addedBox = (
        <div>
          Added: {this.props.repo.added.length}
          <ul>
            {addedNodes}
          </ul>
        </div>
      );
    }

    let repoClassName = 'is-success';

    if (this.props.repo.behind) {
      repoClassName = 'is-danger';
    } else if (this.props.repo.ahead) {
      repoClassName = 'is-warning';
    } else if (modifiedBox) {
      repoClassName = 'is-info';
    }

    let progressing;
    if (this.props.repo.progressing) {
      progressing = <button className={ 'button is-small is-loading ' + repoClassName }>Loading</button>;
    }

    let lastUpdated = 'Updated: ' + moment(this.props.repo.lastUpdate).fromNow();

    return (
      <div className='repo-el column is-4'>
        <div className={ 'notification ' + repoClassName }>
          <button onClick={ this.props.onDelete.bind(this, this.props.repo.dir) } className='delete'></button>
          <header>
            <span className='title is-5'>{this.props.repo.name + ' '}</span>
            <small className=''>@ {this.props.repo.branch}</small>
          </header>

          <article>
            <span>{ this.props.repo.ahead ? 'Ahead: ' + this.props.repo.ahead + ' | ' : '' }</span>
            <span>{ this.props.repo.behind ? 'Behind: ' + this.props.repo.behind + ' | ' : '' }</span>
            <span>{ lastUpdated }</span>
            { modifiedBox }
            { addedBox }
          </article>

          <nav>
            <button onClick={ this.props.onRefresh.bind(this, this.props.repo.dir) } className='button is-small is-light'>
              <span className='icon is-small'>
                <i className='fa fa-refresh'></i>
              </span>
              <span>refresh</span>
            </button>

            <button onClick={ this.props.onPull.bind(this, this.props.repo.dir) }  className='button is-small is-dark'>
              <span className='icon is-small'>
                <i className='fa fa-arrow-down'></i>
              </span>
              <span>pull</span>
            </button>

            { progressing }
          </nav>
        </div>
      </div>
    );
  }
}
