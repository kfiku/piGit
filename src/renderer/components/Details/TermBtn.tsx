import { IRepo } from '../../interfaces/IRepo';

import * as React from 'react';
import styled from 'styled-components';
import { exec } from 'child_process';
import Button from '../helpers/Button';
import Icon from '../helpers/Icon';
import { green } from '../../utils/styles';
const TermIcon = require('react-icons/lib/fa/terminal');

const StyledTerm = styled(TermIcon)`
  vertical-align: baseline !important;
  fill: ${green} !important;
`;

const openInTerminal = (repo) => {
  switch (process.platform) {
    case 'darwin':
      exec(`open -a Terminal.app "${ repo.dir }"`);
      break;
    case 'win32':
      exec(`start /D "${ repo.dir }" cmd`);
      break;
    case 'linux':
      exec(`x-terminal-emulator "${ repo.dir }"`);
      break;

    default:
      break;
  }
};

function TermBtn ({repo}: { repo: IRepo }) {
  return (
    <Button onClick={ openInTerminal.bind(null, repo) } className='button' title='Open in Terminal'>
      <Icon className='icon icon-add'>
        <StyledTerm />
      </Icon>

      <span>Terminal</span>
    </Button>
  );
}

export default TermBtn;
