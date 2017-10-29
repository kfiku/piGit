const { globalShortcut } = require('electron').remote;

import actions from '../actions';
import isAppFocused from '../helpers/isAppFocused';

export default function asyncFunctions(store) {
  // ACTIONS ON KEYS
  let fetchToId, updateStatusToId;
  globalShortcut.register('F5', refresh);
  globalShortcut.register('CommandOrControl+r', refresh);

  function refresh() {
    console.log('refresh');
    if (isAppFocused()) {
      store.dispatch(actions.reloadAllRepos());
    }
  }

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
