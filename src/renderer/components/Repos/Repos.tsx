import { IGroup } from '../../interfaces/IGroup';
// import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// import Sortable = require('sortablejs');

import { renderLog } from '../../helpers/logger';
import { reorderRepo } from '../../actions/reposActions';
import Repo from './Repo';
import StyledRepos from './StyledRepos';

// const onAddRepo = (action, event) => {
//   /**
//    * Put dragged element back to `from` node.
//    * It's needed to avoid React VIRTUAL DOM cleanup.
//    * Otherwise You will get error `can't remove element...`
//    */
//   event.from.appendChild(event.item);

//   action({
//     from: Number(event.from.getAttribute('data-group-i')),
//     to: Number(event.to.getAttribute('data-group-i')),
//     oldIndex: event.oldIndex,
//     newIndex: event.newIndex
//   });
// };

// const onUpdateRepo = (action, event) => {
//   action({
//     from: Number(event.from.getAttribute('data-group-i')),
//     to: Number(event.to.getAttribute('data-group-i')),
//     oldIndex: event.oldIndex,
//     newIndex: event.newIndex
//   });
// };

// const sortableRepos = (action: Function, el) => {
//   if (el) {
//     setTimeout(() => {
//       let options = {
//         animation: 150,
//         handle: '.repo-mover',
//         draggable: '.repo',
//         // forceFallback: true,
//         group: 'shared-repos',
//         onUpdate: onUpdateRepo.bind(null, action),
//         onAdd: onAddRepo.bind(null, action),
//         onClone: function (evt) {
//           evt.clone.parentNode.appendChild(evt.clone);
//         }
//       };

//       Sortable.create(el, options);
//     }, 200);
//   }
// };

interface IReposProps {
  group: IGroup;
  i: number;
  dispatchReorderRepo: Function;
}

class ReposComponent extends React.Component<IReposProps> {
  onDragEnd(result) {
    console.log(result);
    // // dropped outside the list
    // if (!result.destination) {
    //   return;
    // }

    // const items = reorder(
    //   this.state.items,
    //   result.source.index,
    //   result.destination.index
    // );

    // this.setState({
    //   items,
    // });
  }

  render () {
    const { group, i, dispatchReorderRepo } = this.props;
    renderLog('REPOS', group.title);

    let reposNodes = group.repos.map((repo, index) => (
      <Draggable key={ repo } draggableId={repo} index={index}>
        {(provided, snapshot) => (
          <Repo
            innerRef={provided.innerRef}
            group-id={ group.id }
            repo-id={ repo }
            dragHandleProps={provided.dragHandleProps}
            {...provided.draggableProps}
          />
        )}
      </Draggable>
    ));

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <StyledRepos
              className='repos'
              data-group-i={ i }
              // innerRef={(el) => sortableRepos(dispatchReorderRepo, el) }
              innerRef={provided.innerRef}
            >
              { reposNodes }
            </StyledRepos>
          )}
          </Droppable>
      </DragDropContext>
    );
  }
}

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
