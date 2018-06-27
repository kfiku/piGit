import { IGroup } from '../../interfaces/IGroup';
// import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Sortable = require('sortablejs');

import { renderLog } from '../../helpers/logger';
import { reorderRepo } from '../../actions/reposActions';
import Repo from './Repo';
import StyledRepos from './StyledRepos';


const onAddRepo = (action, event) => {
  /**
   * Put dragged element back to `from` node.
   * It's needed to avoid React VIRTUAL DOM cleanup.
   * Otherwise You will get error `can't remove element...`
   */
  event.from.appendChild(event.item);

  action({
    from: Number(event.from.getAttribute('data-group-i')),
    to: Number(event.to.getAttribute('data-group-i')),
    oldIndex: event.oldIndex,
    newIndex: event.newIndex
  });
};

const onUpdateRepo = (action, event) => {
  action({
    from: Number(event.from.getAttribute('data-group-i')),
    to: Number(event.to.getAttribute('data-group-i')),
    oldIndex: event.oldIndex,
    newIndex: event.newIndex
  });
};

const sortableRepos = (action: Function, el) => {
  if (el) {
    setTimeout(() => {
      let options = {
        animation: 150,
        handle: '.repo-mover',
        draggable: '.repo',
        // forceFallback: true,
        group: 'shared-repos',
        onUpdate: onUpdateRepo.bind(null, action),
        onAdd: onAddRepo.bind(null, action),
        onClone: function (evt) {
          evt.clone.parentNode.appendChild(evt.clone);
        }
      };

      Sortable.create(el, options);
    }, 200);
  }
};

interface IReposProps {
  group: IGroup;
  i: number;
  dispatchReorderRepo: Function;
}

const ReposComponent: React.SFC<IReposProps> = ({ group, i, dispatchReorderRepo }) => {
  renderLog('REPOS', group.title);

  let reposNodes = group.repos.map(repo => (
    <Repo key={ repo } group-id={ group.id } repo-id={ repo } />
  ));

  return (
    <StyledRepos className='repos' data-group-i={ i }
      innerRef={(el) => sortableRepos(dispatchReorderRepo, el) }>
      { reposNodes }
    </StyledRepos>
  );
};

ReposComponent.propTypes = {
  dispatchReorderRepo: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  i: PropTypes.number.isRequired
};


const mapStateToProps = (state, ownProps ) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  return { group, i: ownProps['group-i'] };
};

const mapDispatchToProps = {
  dispatchReorderRepo: reorderRepo
};

const Repos = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReposComponent);

export default Repos;
