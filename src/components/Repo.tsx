import * as React from "react";

export interface RepoProps {
  name: string,
  branch: string,
  ahead: number,
  behind: number,
  modified: string[],
  added: string[],
  onDelete: () => any
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

    return (
      <div className="column is-4">
        <div className="notification is-info">
          <button onClick={ this.props.onDelete } className="delete"></button>
          <h5 className="title is-5">
            {this.props.name + " "}
            <span className="tag is-dark">{this.props.branch}</span>
          </h5>

          { this.props.ahead ? 'ahead: ' + this.props.ahead: '' }
          { this.props.behind ? 'behind: ' + this.props.behind: '' }
          { modifiedBox }
        </div>
      </div>
    );
  }
}
