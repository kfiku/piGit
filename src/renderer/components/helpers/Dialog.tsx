import * as React from 'react';
import * as PropTypes from 'prop-types';

import { renderLog } from '../../helpers/logger';
import { Dialog as StyledDialog, Bg, Content } from './StyledDialog';

const Dialog: any = ({msg, ok}) => {
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
};

Dialog.propTypes = {
  msg: PropTypes.string.isRequired,
  ok: PropTypes.func.isRequired,
};

export default Dialog;
