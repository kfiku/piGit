import actions from '../actions';

export default function asyncFunctions(store) {
  // ACTIONS ON KEYS
  window.addEventListener('keyup', function (e) {
    if (e.key === 'F5') {
      store.dispatch(actions.reloadAllRepos());
      console.log('reload all');
    }
  });

  let fetchToId, updateStatusToId;

  function fetchTimeout() {
    clearTimeout(fetchToId);

    fetchToId = setTimeout(() => {
      store.dispatch(actions.reloadAllRepos());
      fetchTimeout();
    }, 5 * 60 * 1000); // 5 minutes
  }

  function updateStatusTimeout() {
    clearTimeout(updateStatusToId);
    updateStatusToId = setTimeout(() => {
      store.dispatch(actions.updateAllReposStatus());
      // this.props.actions.updateRepoStatus(id, dir);
      updateStatusTimeout();
    }, 10 * 1000); // 10 sec
  }

  fetchTimeout();
  updateStatusTimeout();
}
