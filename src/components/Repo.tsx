import * as React from 'react';
import * as moment from 'moment';

const Isvg = require('react-inlinesvg');

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

  updateDate(el) {
    setTimeout(() => {
      if (el && el.innerHTML) {
        el.innerHTML = 'Updated: ' + moment(this.props.repo.lastUpdate).fromNow();
        this.updateDate(el);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  onClick() {
    // let myNotification = new Notification('Title', {
    //   body: 'Lorem Ipsum Dolor Sit Amet'
    // });
  }

  render() {
    let cls = '';

    if (this.props.repo.behind) {
      cls = 'behind';
    } else if (this.props.repo.ahead) {
      cls = 'ahead';
    } else if (this.props.repo.modified && this.props.repo.modified.length) {
      cls = 'modified';
    }

    return (
      <div className={ 'repo ' + cls + (this.props.repo.progressing ? ' progressing' : '')  }>
        <i className='icon icon-move' title='Reorder this repo'>
          <Isvg src='./svg/move.svg' />
        </i>

        <i className='icon icon-x' title='Delete this repo'
        onClick={ this.props.onDelete.bind(this, this.props.repo.dir) } >
          <Isvg src='./svg/x.svg'/>
        </i>

        <i className='icon icon-pull' title='Pull this repo'
        onClick={ this.props.onPull.bind(this, this.props.repo.dir) }>
          <Isvg src='./svg/download-1.svg'/>
        </i>

        <i className='icon icon-refresh' title='Refresh this repo'
        onClick={ this.props.onRefresh.bind(this, this.props.repo.dir) }>
          <Isvg src='./svg/spin-1.svg'/>
        </i>

        <div className='content'>
          <div className='title' title={this.props.repo.dir + ' '}>
            {this.props.repo.name + ' '}
          </div>

          <div className='branch'>
            @ {this.props.repo.branch}
          </div>

          <div className='status'>
            <span className='ahead'>{ this.props.repo.ahead ? 'Ahead: ' + this.props.repo.ahead + ' ' : '' }</span>
            <span className='behind'>{ this.props.repo.behind ? 'Behind: ' + this.props.repo.behind + ' ' : '' }</span>
            <span className='modified'>{ this.props.repo.modified && this.props.repo.modified.length ? 'Modified: ' + this.props.repo.modified.length + ' ' : '' }</span>
          </div>

          <div className='updated' ref={ this.updateDate.bind(this) } >
            { moment(this.props.repo.lastUpdate).fromNow() }
          </div>
        </div>
      </div>
    );

  }

  // render() {
  //   let modifiedBox;
  //   if (this.props.repo.modified && this.props.repo.modified.length) {
  //     let modifiedNodes = this.props.repo.modified.map(mod => (
  //       <li key={mod}>{mod}</li>
  //     ));

  //     modifiedBox = (
  //       <div>
  //         Modified: {this.props.repo.modified.length}
  //         <ul>
  //           {modifiedNodes}
  //         </ul>
  //       </div>
  //     );
  //   }

  //   let addedBox;
  //   if (this.props.repo.added && this.props.repo.added.length) {
  //     let addedNodes = this.props.repo.added.map(mod => (
  //       <li key={mod}>{mod}</li>
  //     ));

  //     addedBox = (
  //       <div>
  //         Added: {this.props.repo.added.length}
  //         <ul>
  //           {addedNodes}
  //         </ul>
  //       </div>
  //     );
  //   }

  //   let repoClassName = 'is-success';

  //   if (this.props.repo.behind) {
  //     repoClassName = 'is-danger';
  //   } else if (this.props.repo.ahead) {
  //     repoClassName = 'is-warning';
  //   } else if (modifiedBox) {
  //     repoClassName = 'is-info';
  //   }

  //   let progressing;
  //   if (this.props.repo.progressing) {
  //     progressing = <button className={ 'button is-small is-loading ' + repoClassName }>Loading</button>;
  //   }

  //   let lastUpdated = 'Updated: ' + moment(this.props.repo.lastUpdate).fromNow();

  //   return (
  //     <div onClick={ this.onClick.bind(this) } className='repo-el column is-4'>
  //       <div className={ 'notification ' + repoClassName }>
  //         <button onClick={ this.props.onDelete.bind(this, this.props.repo.dir) } className='delete'></button>
  //         <header>
  //           <span title={this.props.repo.dir + ' '} className='title is-5'>{this.props.repo.name + ' '}</span>
  //           <small className=''>@ {this.props.repo.branch}</small>
  //         </header>

  //         <article>
  //           <span>{ this.props.repo.ahead ? 'Ahead: ' + this.props.repo.ahead + ' | ' : '' }</span>
  //           <span>{ this.props.repo.behind ? 'Behind: ' + this.props.repo.behind + ' | ' : '' }</span>
  //           <span ref={ this.updateDate.bind(this) }>{ lastUpdated }</span>
  //           { modifiedBox }
  //           { addedBox }
  //         </article>

  //         <nav>
  //           <button onClick={ this.props.onRefresh.bind(this, this.props.repo.dir) } className='button is-small is-light'>
  //             <span className='icon is-small'>
  //               <i className='fa fa-refresh'></i>
  //             </span>
  //             <span>refresh</span>
  //           </button>

  //           <button onClick={ this.props.onPull.bind(this, this.props.repo.dir) }  className='button is-small is-dark'>
  //             <span className='icon is-small'>
  //               <i className='fa fa-arrow-down'></i>
  //             </span>
  //             <span>pull</span>
  //           </button>

  //           { progressing }
  //         </nav>
  //       </div>
  //     </div>
  //   );
  // }
}
