import * as React from 'react';
import { Repo, StateRepo } from './Repo';
import Sortable = require('sortablejs');

const Isvg = require('react-inlinesvg');

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
          handle: '.icon-move',
          draggable: '.repo',
          forceFallback: true,
          group: 'shared-repos',
          onUpdate: this.onUpdateRepo.bind(this),
          onAdd: this.onAddRepo.bind(this)
        };

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
        handle: '.icon-move',
        draggable: '.group',
        forceFallback: true,
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
      return (
        <Repo
          key={repo.dir}
          repo={repo}
          onRefresh={this.props.reloadRepo}
          onDelete={this.props.deleteRepo}
          onPull={this.props.pullRepo}
        />
      );
    });
  }

  renderRepoConfirmDelete (group) {
    return (
      <div className='modal is-active'>
        <div className='modal-background'></div>
        <div className='modal-content'>
          <div className='box'>
            <h3 className='title is-5'>Do you realy won't to remove dir '{ group.title }' with all repos inside?</h3>
            <hr/>
            <a onClick={ this.props.deleteGroup.bind(this, group.id) } className='button is-danger'>Yes</a>
            &nbsp;
            <a onClick={ this.props.cancelDeleteGroup.bind(this, group.id) } className='button'>No</a>
          </div>
        </div>
      </div>
    );
  }

  renderGroupHeader(group) {
    if (group.title === 'default') {
      // on default group
      // <Isvg className='icon icon-refresh' src='./svg/spin-1.svg' title='Refresh all repos from this group'/>
      return (
        <header>
          <Isvg className='icon icon-move' src='./svg/sort.svg' title='Reorder this group'/>
          <span className='title'>{ group.title }</span>
        </header>
      );
    } else if (group.editing) {
      // on group editing
      return (
        <header>
          <input className='title' defaultValue={ group.title }
                 onKeyPress={ this.onChangeGroupName.bind(this, group.id) } />
          <Isvg className='icon icon-x' src='./svg/right-arrow-6.svg'/>
        </header>
      );
    }

    // <Isvg className='icon icon-refresh' src='./svg/spin-1.svg' title='Refresh all repos from this group'/>
    return (
      <header>
        <Isvg className='icon icon-move' src='./svg/sort.svg' title='Reorder this group'/>
        <span onClick={ this.props.startEditGroup.bind(this, group.id) } className='title'>{ group.title }</span>

        <i className='icon icon-x' title='Remove this group'
        onClick={ this.props.confirmDeleteGroup.bind(this, group.id) }>
          <Isvg src='./svg/x.svg' />
        </i>
      </header>
    );
  }

  renderGroups(groups) {
    return groups.map((group, id) => {
      return (
        <div className='group' key={ group.id }>
          { group.confirmDelete ?
            this.renderRepoConfirmDelete(group) : ''
          }

          { this.renderGroupHeader(group) }

          <hr/>

          <div className='repos' ref={ this.sortableRepos.bind(this) } data-repos-id={ id }>
            { this.renderRepos(group.repos) }
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className='groups' ref={ this.sortableGroups.bind(this) }>
        { this.renderGroups(this.props.repos) }
      </div>
    );
  }
}
