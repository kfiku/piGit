import * as React from 'react';
import { basename } from 'path';
import { PropTypes } from 'react';
import { Diff2Html } from 'diff2html';

import actions from '../../actions';
import { renderLog } from '../../helpers/logger';
import repos from '../../helpers/GitRepos';

const loadDiff = (dir, el) => {
  if (!el) {
    return;
  }

  repos.diff(dir, (err, diff) => {
    el.innerHTML = Diff2Html.getPrettyHtml(diff);
  });
};

const Diff: any = ({ dir }: { dir: string, actions: any }) => {
  renderLog('DIFF', dir);

  return (
    <div className='diff' ref={ loadDiff.bind(null, dir) }>
      loading { dir }...
    </div>
  );
};

Diff.propTypes = {
  dir: PropTypes.string.isRequired,
};

export default Diff;
