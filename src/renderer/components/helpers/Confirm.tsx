import * as React from 'react';

import { renderLog } from '../../helpers/logger';
import { Dialog, Bg, Content } from './StyledDialog';


interface IConfirm {
  yes: () => {};
  no: () => {};
  msg: string;
}

const Confirm: any = ({msg, yes, no}: IConfirm) => {
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

export default Confirm;
