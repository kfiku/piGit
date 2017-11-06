import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import { exec } from 'child_process';
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import GitIcon from '../Icons/GitIcon';

const openInGitGui = (repo) => {
  exec(`cd ${ repo.dir } && git gui`);
};

function GitGuiBtn ({repo}: { repo: IRepo }) {
  return (
    <Button onClick={ openInGitGui.bind(null, repo) } className='button' title='Open in Git Gui'>
      <Icon className='icon icon-add'>
        <GitIcon />
      </Icon>

      <span>GitGUI</span>
    </Button>
  );
}

export default GitGuiBtn;
