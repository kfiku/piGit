import * as React from 'react';
import Dialog from './helpers/Dialog';

interface IMessageProps {
  msg: string;
  close: () => {};
}

function Message({ msg, close }: IMessageProps) {
  if (msg !== '') {
    // if message is there
    return <Dialog msg={msg} ok={close} />;
  } else {
    // if message is empty
    return null;
  }
};

export default Message;
