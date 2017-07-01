import * as React from 'react';
import * as jquery from 'jquery';
import { basename } from 'path';
import { PropTypes } from 'react';
import { Diff2Html } from 'diff2html';
import { Diff2HtmlUI } from 'diff2html/src/ui/js/diff2html-ui';
// import * as Diff2HtmlUI from 'diff2html/src/ui/js/diff2html-ui';
import * as hljs from 'highlight.js';
// var jquery = require('juery');
// console.log(jQuery);

// console.log(jquery);
// console.log(highlightBlock);

import actions from '../../actions';
import { renderLog } from '../../helpers/logger';
import repos from '../../helpers/GitRepos';

window.jQuery = window.$ = jquery;
window.hljs = hljs;
window.Diff2Html = Diff2Html;

const loadDiff = (dir, el: HTMLBaseElement) => {
  if (!el) {
    return;
  }

  repos.diff(dir, (err, diff) => {
    // console.log(Diff2HtmlUI);
    const diff2HtmlUI = new Diff2HtmlUI({ diff });
    diff2HtmlUI.draw("#differ", {inputFormat: 'json', showFiles: false, matching: 'lines', outputFormat: 'side-by-side'});
    diff2HtmlUI.highlightCode("#differ");
    // el.innerHTML = Diff2Html.getPrettyHtml(diff, {
    //   outputFormat: 'side-by-side'
    // });

    // el.querySelectorAll('pre code')
    // highlightBlock(el);
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
