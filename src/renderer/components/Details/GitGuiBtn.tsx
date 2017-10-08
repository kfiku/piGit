import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import { exec } from 'child_process';
const Isvg = require('react-inlinesvg');
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';

const openInGitGui = (repo) => {
  exec(`cd ${ repo.dir } && git gui`);
};

function GitGuiBtn ({repo}: { repo: IRepo }) {
  return (
    <Button onClick={ openInGitGui.bind(null, repo) } className='button'>
      <Icon className='icon icon-add'>
        <Isvg src='./svg/git-icon.svg'/>
      </Icon>

      <span>Git GUI</span>
    </Button>
  );
}

export default GitGuiBtn;
