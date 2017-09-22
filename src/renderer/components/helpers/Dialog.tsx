import * as React from 'react';
import * as PropTypes from 'prop-types';

import { renderLog } from '../../helpers/logger';
import { Dialog as StyledDialog, Bg, Content } from './StyledDialog';

interface IDialog {
  ok?: () => {};
  msg: string;
}

function Dialog ({ msg, ok }: IDialog) {
  renderLog('DIALOG');
  return (
    <StyledDialog>
      <Content>
        <p>{ msg }</p>

        <footer>
          <button className='btn' onClick={ ok }>OK</button>
        </footer>
      </Content>

      <Bg />
    </StyledDialog>
  );
}

export default Dialog;
