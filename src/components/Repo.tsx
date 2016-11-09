import * as React from 'react';

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
    setTimeout(() => { props.onRefresh(props.repo.dir); }, 200);
  }

  render() {
    let modifiedBox;
    if (this.props.repo.modified && this.props.repo.modified.length) {
      let modifiedNodes = this.props.repo.modified.map(mod => (
        <li key={mod}>{mod}</li>
      ));

      modifiedBox = (
        <div>
          modified: {this.props.repo.modified.length}
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
        <div>z
          added: {this.props.repo.added.length}
          <ul>
            {addedNodes}
          </ul>
        </div>
      );
    }

    let progressing;
    if (this.props.repo.progressing) {
      progressing = <button className='button is-small is-info is-loading'>Loading</button>;
    }

    return (
      <div className='column is-4'>
        <div className='notification is-info'>
          <button onClick={ this.props.onDelete.bind(this, this.props.repo.dir) } className='delete'></button>
          <header>
            <span className='title is-5'>{this.props.repo.name + ' '}</span>
            <small className=''>@ {this.props.repo.branch}</small>
          </header>

          <nav>
            <button onClick={ this.props.onRefresh.bind(this, this.props.repo.dir) } className='button is-small is-warning'>
              <span className='icon is-small'>
                <i className='fa fa-refresh'></i>
              </span>
              <span>refresh</span>
            </button>

            <button onClick={ this.props.onPull.bind(this, this.props.repo.dir) }  className='button is-small is-success'>
              <span className='icon is-small'>
                <i className='fa fa-arrow-down'></i>
              </span>
              <span>pull</span>
            </button>

            { progressing }
          </nav>

          { this.props.repo.ahead ? 'ahead: ' + this.props.repo.ahead : '' }
          { this.props.repo.behind ? 'behind: ' + this.props.repo.behind : '' }
          { modifiedBox }
          { addedBox }
        </div>
      </div>
    );
  }
}
