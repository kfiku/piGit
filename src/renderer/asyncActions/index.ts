// const { globalShortcut } = require('electron').remote;

import actions from '../actions';
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
    store.dispatch(actions.updateAllReposStatus());
  });

  function refresh() {
    if (isAppFocused()) {
      console.log('refresh');
      store.dispatch(actions.reloadAllRepos());
    }
  }

  function fetchTimeout() {
    clearTimeout(fetchToId);

    fetchToId = setTimeout(() => {
      console.log('fetchTimeout');
      store.dispatch(actions.reloadAllRepos());
      fetchTimeout();
    }, 5 * 60 * 1000); // 5 minutes
  }

  function updateStatusTimeout() {
    clearTimeout(updateStatusToId);
    updateStatusToId = setTimeout(() => {
      console.log('updateStatusTimeout');
      store.dispatch(actions.updateAllReposStatus());
      updateStatusTimeout();
    }, 10 * 1000); // 10 sec
  }

  fetchTimeout();
  updateStatusTimeout();
}
