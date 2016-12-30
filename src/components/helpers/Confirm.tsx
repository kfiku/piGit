import * as React from 'react';
import { PropTypes } from 'react';

const Isvg = require('react-inlinesvg');
import { renderLog } from '../../helpers/logger';

const Confirm: any = ({msg, yes, no}) => {
  renderLog('DIALOG');
  return (
    <div className='dialog confirm'>
      <div className='dialog-content'>
        <p>{ msg }</p>

        <footer>
          <button className='btn' onClick={ yes }>Yes</button>
          <button className='btn' onClick={ no }>No</button>
        </footer>
      </div>

      <div className='dialog-background'></div>
    </div>
  );
};

Confirm.propTypes = {
  msg: PropTypes.string.isRequired,
  yes: PropTypes.func.isRequired,
  no: PropTypes.func.isRequired,
};

export default Confirm;
