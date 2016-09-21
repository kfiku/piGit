import * as React from "react";

export interface RepoProps {
  name: string,
  branch: string,
  ahead: number,
  behind: number,
  modified: string[],
  added: string[],
  onDelete: () => any
  onRefresh: () => any
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
        <div>
          added: {this.props.added.length}
          <ul>
            {addedNodes}
          </ul>
        </div>
      );
    }

    return (
      <div className="column is-4">
        <div className="notification is-info">
          <button onClick={ this.props.onDelete } className="delete"></button>

          <div>
            <span className="title is-4">{this.props.name + " "}</span>
            <span className="tag is-dark">{this.props.branch}</span>
            <span className="tag is-warning" onClick={ this.props.onRefresh }>refresh</span>
          </div>

          { this.props.ahead ? 'ahead: ' + this.props.ahead: '' }
          { this.props.behind ? 'behind: ' + this.props.behind: '' }
          { modifiedBox }
          { addedBox }
        </div>
      </div>
    );
  }
}
