import * as React from 'react';
import * as PropTypes from 'prop-types';

import { renderLog } from '../../helpers/logger';
import { Dialog, Bg, Content } from './StyledDialog';

const Confirm: any = ({msg, yes, no}) => {
  renderLog('DIALOG');
  return (
    <Dialog className='confirm'>
      <Content className='dialog-content'>
        <p>{ msg }</p>

        <footer>
          <button className='btn' onClick={ yes }>Yes</button>
          { ' ' }
          <button className='btn' onClick={ no }>No</button>
        </footer>
      </Content>

      <Bg className='dialog-background'></Bg>
    </Dialog>
  );
};

Confirm.propTypes = {
  msg: PropTypes.string.isRequired,
  yes: PropTypes.func.isRequired,
  no: PropTypes.func.isRequired,
};

export default Confirm;
