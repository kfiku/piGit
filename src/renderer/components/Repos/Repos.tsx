import { IGroup } from '../../interfaces/IGroup';
// import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sortable = require('sortablejs');

import { renderLog } from '../../helpers/logger';
import actionsToConnect from '../../actions';
import Repo from './Repo';
import StyledRepos from './StyledRepos';


const onAddRepo = (actions, event) => {
  /**
   * Put dragged element back to `from` node.
   * It's needed to avoid React VIRTUAL DOM cleanup.
   * Otherwise You will get error `can't remove element...`
   */
  event.from.appendChild(event.item);

  actions.reorderRepo({
    from: Number(event.from.getAttribute('data-group-i')),
    to: Number(event.to.getAttribute('data-group-i')),
    oldIndex: event.oldIndex,
    newIndex: event.newIndex
  });
};

const onUpdateRepo = (actions, event) => {
  actions.reorderRepo({
    from: Number(event.from.getAttribute('data-group-i')),
    to: Number(event.to.getAttribute('data-group-i')),
    oldIndex: event.oldIndex,
    newIndex: event.newIndex
  });
};

const sortableRepos = (actions, el) => {
  if (el) {
    setTimeout(() => {
      let options = {
        animation: 150,
        handle: '.repo-mover',
        draggable: '.repo',
        // forceFallback: true,
        group: 'shared-repos',
        onUpdate: onUpdateRepo.bind(null, actions),
        onAdd: onAddRepo.bind(null, actions),
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
  actions: any;
}

const ReposComponent: React.SFC<IReposProps> = ({ group, i, actions }) => {
  renderLog('REPOS', group.title);

  let reposNodes = group.repos.map(repo => (
    <Repo key={ repo } group-id={ group.id } repo-id={ repo } />
  ));

  return (
    <StyledRepos className='repos' data-group-i={ i }
    innerRef={ sortableRepos.bind(null, actions) }>
      { reposNodes }
    </StyledRepos>
  );
};

ReposComponent.propTypes = {
  actions: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  i: PropTypes.number.isRequired
};


const mapStateToProps = (state, ownProps ) => {
  const group = state.groups.filter(g => g.id === ownProps['group-id'])[0];
  return { group, i: ownProps['group-i'] };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionsToConnect, dispatch)
});

const Repos = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReposComponent);

export default Repos;
