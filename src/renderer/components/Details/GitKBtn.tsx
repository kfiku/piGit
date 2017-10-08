import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import { exec } from 'child_process';
const Isvg = require('react-inlinesvg');
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';


const openInGitK = (repo) => {
  exec(`cd ${ repo.dir } && gitk`);
};

function GitGuiBtn ({repo}: { repo: IRepo }) {
  return (
    <Button onClick={ openInGitK.bind(null, repo) } className='button'>
      <Icon className='icon icon-add'>
        <Isvg src='./svg/git-icon.svg'/>
      </Icon>

      <span>GitK</span>
    </Button>
  );
}

export default GitGuiBtn;
