import * as React from 'react';
import { PropTypes } from 'react';

import { renderLog } from '../../helpers/logger';

const Dialog: any = ({msg, ok}) => {
  renderLog('DIALOG');
  return (
    <div className='dialog'>
      <div className='dialog-content'>
        <p>{ msg }</p>

        <footer>
          <button className='btn' onClick={ ok }>OK</button>
        </footer>
      </div>

      <div className='dialog-background'></div>
    </div>
  );
};

Dialog.propTypes = {
  msg: PropTypes.string.isRequired,
  ok: PropTypes.func.isRequired,
};

export default Dialog;
