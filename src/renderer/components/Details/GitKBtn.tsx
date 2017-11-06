import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import { exec } from 'child_process';
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import GitIcon from '../Icons/GitIcon';


const openInGitK = (repo) => {
  exec(`cd ${ repo.dir } && gitk`);
};

function GitKBtn ({repo}: { repo: IRepo }) {
  return (
    <Button onClick={ openInGitK.bind(null, repo) } className='button' title='Open in GitK'>
      <Icon className='icon icon-add'>
        <GitIcon />
      </Icon>

      <span>GitK</span>
    </Button>
  );
}

export default GitKBtn;
