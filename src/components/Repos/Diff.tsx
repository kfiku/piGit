import * as React from 'react';
import * as jquery from 'jquery';
import { basename } from 'path';
import * as PropTypes from 'prop-types';
import { Diff2Html } from 'diff2html';
import { Diff2HtmlUI } from 'diff2html/src/ui/js/diff2html-ui';
import * as hljs from 'highlight.js';

import actions from '../../actions';
import { renderLog } from '../../helpers/logger';
import repos from '../../helpers/GitRepos';

(window as any).jQuery = (window as any).$ = jquery;
(window as any).hljs = hljs;
(window as any).Diff2Html = Diff2Html;

const loadDiff = (dir, el: HTMLBaseElement) => {
  if (!el) {
    return;
  }

  repos.diff(dir, (err, diff) => {
    if (diff) {
      const diff2HtmlUI = new Diff2HtmlUI({ diff });
      diff2HtmlUI.draw("#differ", {inputFormat: 'json', showFiles: false, matching: 'lines', outputFormat: 'side-by-side'});
      diff2HtmlUI.highlightCode("#differ");
    }
  });
};

const Diff: any = ({ dir }: { dir: string, actions: any }) => {
  renderLog('DIFF', dir);

  return (
    <div className='diff' id="differ" ref={ loadDiff.bind(null, dir) }>
      loading { dir }...
    </div>
  );
};

Diff.propTypes = {
  dir: PropTypes.string.isRequired,
};

export default Diff;
