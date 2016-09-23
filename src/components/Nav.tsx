import * as React from 'react';

export interface NavProps { dialog: any; }

export class Nav extends React.Component<NavProps, {}> {
  render() {
    return (
      <div>
        <nav className='nav main-nav'>
          <div className='nav-left'>
            <span className='nav-item'>
              <button onClick={this.props.dialog} className='button' >
                <span className='icon'>
                  <i className='fa fa-plus'></i>
                </span>
                <span>Add Repo</span>
              </button>
            </span>
          </div>
        </nav>
      </div>
    );
  }
}
