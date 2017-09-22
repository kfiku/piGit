import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';

import { navHeight, g1, g2, g4, g7, defaultFont } from '../../utils/styles';
import { renderLog } from '../../helpers/logger';

const Dialog = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
`;

const Content = styled.div`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  z-index: 101;
  padding: 16px;


  border-radius: $br * 2;
  background-color: white;

  p {
    margin-top: 0;
  }
`;

const Bg = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
  background-color: rgba(10, 10, 10, 0.86);
`;

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
