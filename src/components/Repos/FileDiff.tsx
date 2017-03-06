import { IGroup } from '../../interfaces/IGroup';
import { IRepo } from '../../interfaces/IRepo';
const Prism = require('../../../lib/prism/prism.js');

import * as React from 'react';
import * as moment from 'moment';
import { basename, extname } from 'path';
import { readFile } from 'fs';
import { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const Isvg = require('react-inlinesvg');

import actions from '../../actions';
import { renderLog } from '../../helpers/logger';

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
  // console.log(el, file);
  console.log(Prism.languages);

  readFile(file, 'utf-8', (err, content) => {
    // console.log(err, content);
    let html = Prism.highlight(content, Prism.languages[lang]);
    el.innerHTML = html;
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
      <link href='../lib/prism/prism.css' rel='stylesheet' />

      <h4 className='header'>
        Diff for file: { file }
      </h4>

      <i className='icon icon-x' title='Delete this repo' onClick={ actions.fileDiff.bind(null, '') }>
        <Isvg src='./svg/x.svg'/>
      </i>


      <pre className={ 'language-' + prismLang.lang} ref={ loadfile.bind(null, file, prismLang.lang) }>
          loading { file }...
      </pre>
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
