import * as React from 'react';
import * as moment from 'moment';
import { IRepo } from '../interfaces/IRepo';

const Isvg = require('react-inlinesvg');

export interface RepoProps {
  repo: IRepo;
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
        el.innerHTML = moment(this.props.repo.lastUpdate).fromNow();
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
          <Isvg src='./svg/down-arrow.svg'/>
        </i>

        <i className='icon icon-refresh' title='Refresh this repo'
        onClick={ this.props.onRefresh.bind(this, this.props.repo.dir) }>
          <Isvg src='./svg/reload.svg'/>
        </i>

        <div className='content'>
          <div className='title' title={this.props.repo.dir + ' '}>
            {this.props.repo.name + ' '}
          </div>

          <div className='branch'>
            @ {this.props.repo.branch}
          </div>

          <div className='status'>
            { this.props.repo.ahead ?
              <span className='ahead'>Ahead: { this.props.repo.ahead }</span> : ''
            }

            { this.props.repo.behind ?
              <span className='behind'>Behind: { this.props.repo.behind }</span> : ''
            }

            { (this.props.repo.modified && this.props.repo.modified.length) ?
              <span className='modified'>Modified: { this.props.repo.modified.length }</span> : ''
            }
          </div>

          <div className='updated' title='Updated from now' ref={ this.updateDate.bind(this) } >
            { moment(this.props.repo.lastUpdate).fromNow() }
          </div>
        </div>
      </div>
    );

  }
}
