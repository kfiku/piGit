import { MESSAGE } from '../constants/ActionTypes';

export const message = (msg: string) => (
  { type: MESSAGE, msg }
);

export const close = () => (
  { type: MESSAGE, msg: '' }
);
