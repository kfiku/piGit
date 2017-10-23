import * as React from 'react';
import * as jquery from 'jquery';
import * as PropTypes from 'prop-types';
import { Diff2Html } from 'diff2html';
import { Diff2HtmlUI } from 'diff2html/src/ui/js/diff2html-ui';
import * as hljs from 'highlight.js';

import '../../css/default.css';
import '../../css/solarized-light.css';
import '../../css/diff2html.min.css';

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
    console.log('diff');
    if (!err && diff) {
      const diff2HtmlUI = new Diff2HtmlUI({ diff });
      diff2HtmlUI.draw(
        '#differ',
        {inputFormat: 'json', showFiles: false, matching: 'lines', outputFormat: 'side-by-side'}
      );
      diff2HtmlUI.highlightCode('#differ');
    }
  });
};


interface IDiff {
  dir: string;
}


class Diff extends React.PureComponent<IDiff> {
  render() {
    const { dir } = this.props;
    renderLog('DIFF', dir);

    return (
      <div className='diff' id='differ' ref={ loadDiff.bind(null, dir) }>
        loading { dir }...
      </div>
    );
  }
}

export default Diff;
