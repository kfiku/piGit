import * as React from 'react';
import * as jquery from 'jquery';
import { Diff2Html } from 'diff2html';
import { Diff2HtmlUI } from 'diff2html/src/ui/js/diff2html-ui';
import * as hljs from 'highlight.js';

import '../../css/default.css';
import '../../css/solarized-light.css';
import '../../css/diff2html.min.css';

import { renderLog } from '../../helpers/logger';
import repos from '../../helpers/GitRepos';
import { DiffLoader } from './index';

(window as any).jQuery = (window as any).$ = jquery;
(window as any).hljs = hljs;
(window as any).Diff2Html = Diff2Html;

async function loadDiff(dir: string, file: string, wide: boolean, el: HTMLBaseElement) {
  if (!el) {
    return;
  }
  try {
    const diff = await repos.diff(dir, file);

    if (diff.length > 10000) {
      document.getElementById('differ').innerHTML = `
        <pre><code>${diff.replace(/</gm, '&lt;').replace(/>/gm, '&gt;')}</code></pre>
      `;
    } else if (diff) {
      const diff2HtmlUI = new Diff2HtmlUI({ diff });
      diff2HtmlUI.draw(
        '#differ',
        {
          inputFormat: 'json',
          showFiles: false,
          matching: 'lines',
          outputFormat: wide ? 'side-by-side' : 'line-by-line'
        }
      );
      diff2HtmlUI.highlightCode('#differ');
    } else {
      // console.log(el.children[0]);
      el.innerHTML = '<div style="padding: 16px;">nothing to diff</div>';
    }
  } catch (e) {
    document.getElementById('differ').innerHTML = e;
  }
}

interface IDiff {
  dir: string;
  fileShown: string;
  wide: boolean;
}

class Diff extends React.PureComponent<IDiff> {
  render() {
    const { dir, wide, fileShown } = this.props;
    renderLog('DIFF', dir);

    return (
      <div className='diff' id='differ' ref={(el: any) => loadDiff(dir, fileShown, wide, el) }>
        <DiffLoader>
          loading git diff for repo {dir}/{fileShown}...
        </DiffLoader>
      </div>
    );
  }
}

export default Diff;
