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
    updateStatus();
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
      fetch();
      fetchTimeout();
    }, 5 * 60 * 1000); // 5 minutes
  }

  function updateStatusTimeout() {
    clearTimeout(updateStatusToId);
    updateStatusToId = setTimeout(() => {
      updateStatus();
      updateStatusTimeout();
    }, 60 * 1000); // 1 min
  }

  function isGitBusy() {
    const { repos, app } = store.getState();
    const busyGits = repos && repos.filter(r => r.progressing || r.pulling).length;
    const isBusy = busyGits > 0 || app.reloadingAllRepos || app.reloadingAllReposStatus;
    console.log('ASYNC ACTIONS busyGits: ', isBusy);
    return isBusy;
  }

  function updateStatus() {
    if (!isGitBusy()) {
      console.log('ASYNC ACTIONS updateStatus');
      store.dispatch(updateAllReposStatus());
    }
  }

  function fetch() {
    if (!isGitBusy()) {
      console.log('ASYNC ACTIONS fetch');
      store.dispatch(reloadAllRepos());
    }
  }

  fetchTimeout();
  updateStatusTimeout();
}
