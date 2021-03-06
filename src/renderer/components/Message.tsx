import * as React from 'react';
import Dialog from './helpers/Dialog';

interface Props {
  msg: string;
  close: () => {};
}

function Message({ msg, close }: Props) {
  if (msg === '') {
    // if message is there
    return null;
  }

  return <Dialog msg={msg} ok={close} />;
}

export default Message;
