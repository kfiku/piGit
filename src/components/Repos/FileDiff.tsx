import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';
// const Prism = require('../../../lib/prism/prism.js');

import * as React from 'react';
import * as moment from 'moment';
import { basename, extname } from 'path';
import { readFile } from 'fs';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Diff2Html } from 'diff2html';
console.log(Diff2Html);
const Isvg = require('react-inlinesvg');

import actions from '../../actions';
import { renderLog } from '../../helpers/logger';
import repos from '../../helpers/GitRepos';

let extMap = [
  { ext: 'js', lang: 'javascript' },
  { ext: 'py', lang: 'python' },
  { ext: 'rb', lang: 'ruby' },
  { ext: 'ps1', lang: 'powershell' },
  { ext: 'psm1', lang: 'powershell' },
  { ext: 'sh', lang: 'bash' },
  { ext: 'bat', lang: 'batch' },
  { ext: 'h', lang: 'c' },
  { ext: 'yml', lang: 'yaml' },
  { ext: 'ts', lang: 'typescript' },
  { ext: 'php', lang: 'php' },
  { ext: 'tex', lang: 'latex' }
];

const loadfile = (file, lang, el) => {
  if (!el) {
    return;
  }
  console.log(el, file);
  // console.log(Prism.languages);

  repos.diff(file, (err, diff) => {
    el.innerHTML = Diff2Html.getPrettyHtml(diff);
  });

};

const FileDiffComponent: any = ({ file, actions }: { file: string, actions: any }) => {
  if (!file) {
    renderLog('FILE DIFF EMPTY');
    return <div></div>;
  }

  renderLog('FILE DIFF', file);

  let ext = extname(file).replace('.', '');
  let prismLang = extMap.filter(e => e.ext === ext)[0] || { lang: ext };

  console.log(prismLang);

  return (
    <div className='file-diff'>
      <link href='../node_modules/diff2html/dist/diff2html.css' rel='stylesheet' />

      <h4 className='header'>
        Diff for file: { file }
      </h4>

      <i className='icon icon-x' title='Delete this repo' onClick={ actions.fileDiff.bind(null, '') }>
        <Isvg src='./svg/x.svg'/>
      </i>


      <div className={ 'language-' + prismLang.lang} ref={ loadfile.bind(null, file, prismLang.lang) }>
          loading { file }...
      </div>
    </div>
  );
};

FileDiffComponent.propTypes = {
  actions: PropTypes.object.isRequired
};


const mapStateToProps = (state, ownProps = {}) => {
  return { file: state.app.fileShown };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const FileDiff = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDiffComponent);

export default FileDiff;