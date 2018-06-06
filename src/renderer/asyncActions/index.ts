// const { globalShortcut } = require('electron').remote;

import { reloadAllRepos, updateAllReposStatus } from '../actions/reposActions';
import isAppFocused from '../helpers/isAppFocused';

export default function asyncFunctions(store) {
  // ACTIONS ON KEYS
  let fetchToId, updateStatusToId;
  // globalShortcut.register('F5', refresh);
  // globalShortcut.register('CommandOrControl+r', refresh);
  window.addEventListener('keyup', function (e) {
    if (e.key === 'F5') {
      refresh();
    }
  });

  window.addEventListener('focus', function () {
    store.dispatch(updateAllReposStatus());
  });

  function refresh() {
    if (isAppFocused()) {
      console.log('refresh');
      store.dispatch(reloadAllRepos());
    }
  }

  function fetchTimeout() {
    clearTimeout(fetchToId);

    fetchToId = setTimeout(() => {
      console.log('fetchTimeout');
      store.dispatch(reloadAllRepos());
      fetchTimeout();
    }, 5 * 60 * 1000); // 5 minutes
  }

  function updateStatusTimeout() {
    clearTimeout(updateStatusToId);
    updateStatusToId = setTimeout(() => {
      console.log('updateStatusTimeout');
      store.dispatch(updateAllReposStatus());
      updateStatusTimeout();
    }, 60 * 1000); // 1 min
  }

  fetchTimeout();
  updateStatusTimeout();
}
