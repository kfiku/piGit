import * as React from 'react';

export interface RepoProps {
  name: string;
  branch: string;
  ahead: number;
  behind: number;
  progressing: boolean;
  modified: string[];
  added: string[];
  onDelete: () => any;
  onRefresh: () => any;
  onPull: () => any;
}

export class Repo extends React.Component<RepoProps, {}> {
  render() {
    let modifiedBox;
    if (this.props.modified && this.props.modified.length) {
      let modifiedNodes = this.props.modified.map(mod => (
        <li key={mod}>{mod}</li>
      ));

      modifiedBox = (
        <div>
          modified: {this.props.modified.length}
          <ul>
            {modifiedNodes}
          </ul>
        </div>
      );
    }

    let addedBox;
    if (this.props.added && this.props.added.length) {
      let addedNodes = this.props.added.map(mod => (
        <li key={mod}>{mod}</li>
      ));

      addedBox = (
        <div>z
          added: {this.props.added.length}
          <ul>
            {addedNodes}
          </ul>
        </div>
      );
    }

    let progressing;
    if (this.props.progressing) {
      progressing = <button className='button is-small is-info is-loading'>Loading</button>;
    }

    return (
      <div className='column is-4'>
        <div className='notification is-info'>
          <button onClick={ this.props.onDelete } className='delete'></button>

          <header>
            <span className='title is-5'>{this.props.name + ' '}</span>
            <small className=''>@ {this.props.branch}</small>
          </header>

          <nav>
            <button className='button is-small is-warning' onClick={ this.props.onRefresh }>
              <span className='icon is-small'>
                <i className='fa fa-refresh'></i>
              </span>
              <span>refresh</span>
            </button>
            <button className='button is-small is-success' onClick={ this.props.onPull }>
              <span className='icon is-small'>
                <i className='fa fa-arrow-down'></i>
              </span>
              <span>pull</span>
            </button>
            { progressing }
          </nav>

          { this.props.ahead ? 'ahead: ' + this.props.ahead : '' }
          { this.props.behind ? 'behind: ' + this.props.behind : '' }
          { modifiedBox }
          { addedBox }
        </div>
      </div>
    );
  }
}
