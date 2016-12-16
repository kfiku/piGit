import * as React from 'react';
import { Repo, StateRepo } from './Repo';
import Sortable = require('sortablejs');

// let Sortable = require('react-sortablejs');

export interface ReposProps {
  reloadRepo: any;
  pullRepo: any;

  deleteRepo: any;
  reorderRepo: any;

  reorderGroup: any;
  deleteGroup: any;
  confirmDeleteGroup: any;
  cancelDeleteGroup: any;
  startEditGroup: any;
  editGroup: any;
  repos: { title: string, repos: StateRepo[] }[];
}

export class Repos extends React.Component<ReposProps, {}> {
  sortableRepos (el) {
    if (el) {
      setTimeout(() => {
        let options = {
          animation: 150,
          handle: '.title',
          draggable: '.repo',
          forceFallback: true,
          group: 'shared-repos',
          onUpdate: this.onUpdateRepo.bind(this),
          onAdd: this.onAddRepo.bind(this)
        };

        console.log(el);

        Sortable.create(el, options);
      }, 200);

    }
  }

  onUpdateRepo(event) {
    this.props.reorderRepo({
      from: Number(event.from.getAttribute('data-repos-id')),
      to: Number(event.to.getAttribute('data-repos-id')),
      oldIndex: event.oldIndex,
      newIndex: event.newIndex
    });
  }

  onAddRepo(event) {
    /**
     * Put dragged element back to `from` node.
     * It's needed to avoid React VIRTUAL DOM cleanup.
     * Otherwise You will get error `can't remove element...`
     */
    event.from.appendChild(event.item);

    this.props.reorderRepo({
      from: Number(event.from.getAttribute('data-repos-id')),
      to: Number(event.to.getAttribute('data-repos-id')),
      oldIndex: event.oldIndex,
      newIndex: event.newIndex
    });
  }

  sortableGroups (el) {
    if (el) {
      let options = {
        animation: 150,
        handle: '.mover',
        draggable: '.message',
        // forceFallback: true,
        onUpdate: this.onUpdateGroup.bind(this),
      };

      Sortable.create(el, options);
    }
  }

  onChangeGroupName (id, e) {
    if (e.key === 'Enter') {
      this.props.editGroup(id, e.target.value);
    }
  }

  onUpdateGroup(event) {
    this.props.reorderGroup({
      oldIndex: event.oldIndex,
      newIndex: event.newIndex
    });
  }

  renderRepos(repos) {
    return repos.map(repo => {
      return (<Repo key={repo.dir}
                    repo={repo}
                    onRefresh={this.props.reloadRepo}
                    onDelete={this.props.deleteRepo}
                    onPull={this.props.pullRepo}
                  />);
    });
  }

  renderRepoConfirmDelete (group, id) {
    return (
      <div className='modal is-active'>
        <div className='modal-background'></div>
        <div className='modal-content'>
          <div className='box'>
            <h3 className='title is-5'>Do you realy won't to remove dir '{ group.title }' with all repos inside?</h3>
            <hr/>
            <a onClick={ this.props.deleteGroup.bind(this, id) } className='button is-danger'>Yes</a>
            &nbsp;
            <a onClick={ this.props.cancelDeleteGroup.bind(this, id) } className='button'>No</a>
          </div>
        </div>
      </div>
    );
  }

  renderReposGroups(groups) {
    return groups.map((group, id) => {
      // let groupTitle = <span onClick={ this.props.startEditGroup.bind(this, id) }>
      //                     { group.title }
      //                   </span>;
      // let deleteBtn = <button onClick={ this.props.confirmDeleteGroup.bind(this, id) } className='delete'/>;
      // let confirmDelete;

      // if (group.title === 'default') {
      //   groupTitle = <span>{ group.title }</span>;
      //   deleteBtn = <span/>;
      // }

      // if (group.editing) {
      //   groupTitle = (<input onKeyPress={ this.onChangeGroupName.bind(this, id) }
      //                        className='input' defaultValue={ group.title }/>);
      // }

      // if (group.confirmDelete) {
      //   confirmDelete =  this.renderRepoConfirmDelete(group, id);
      // }


      return (
        <div className='group repos'
             key={ group.id }
             ref={ this.sortableRepos.bind(this) }
             data-repos-id={ id }>
          {/* * /}
          { confirmDelete }
          <div className='message-header control is-grouped'>
            <p className='control mover icon is-small'>
              <i className='fa fa-arrows-v' />
            </p>

            <p className='control  is-expanded'>
              { groupTitle }
            </p>

            <p className='control'>
              { deleteBtn }
            </p>
          </div>
          { this.renderRepos(group.repos) }
          {/* */}
          <div className="repo"><div className="title" title="/var/www/github/electron-quick-start ">electron-quick-start </div></div><div className="repo"><div className="title" title="/var/www/github/syntaxhighlighter ">syntaxhighlighter </div></div><div className="repo"><div className="title" title="/var/www/github/LoanJS ">LoanJS </div></div><div className="repo"><div className="title" title="/var/www/github/redux ">redux </div></div><div className="repo"><div className="title" title="/var/www/github/piGit ">piGit </div></div><div className="repo"><div className="title" title="/var/www/github/todomvc ">todomvc </div></div><div className="repo"><div className="title" title="/var/www/github/blog.kfiku.com ">blog.kfiku.com </div></div>
          <div className="repo"><div className="title" title="/var/www/github/electron-quick-start ">electron-quick-start </div></div><div className="repo"><div className="title" title="/var/www/github/syntaxhighlighter ">syntaxhighlighter </div></div><div className="repo"><div className="title" title="/var/www/github/LoanJS ">LoanJS </div></div><div className="repo"><div className="title" title="/var/www/github/redux ">redux </div></div><div className="repo"><div className="title" title="/var/www/github/piGit ">piGit </div></div><div className="repo"><div className="title" title="/var/www/github/todomvc ">todomvc </div></div><div className="repo"><div className="title" title="/var/www/github/blog.kfiku.com ">blog.kfiku.com </div></div>
          <div className="repo"><div className="title" title="/var/www/github/electron-quick-start ">electron-quick-start </div></div><div className="repo"><div className="title" title="/var/www/github/syntaxhighlighter ">syntaxhighlighter </div></div><div className="repo"><div className="title" title="/var/www/github/LoanJS ">LoanJS </div></div><div className="repo"><div className="title" title="/var/www/github/redux ">redux </div></div><div className="repo"><div className="title" title="/var/www/github/piGit ">piGit </div></div><div className="repo"><div className="title" title="/var/www/github/todomvc ">todomvc </div></div><div className="repo"><div className="title" title="/var/www/github/blog.kfiku.com ">blog.kfiku.com </div></div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className='groups' ref={ this.sortableGroups.bind(this) }>
        { this.renderReposGroups(this.props.repos) }
      </div>
    );
  }
}
