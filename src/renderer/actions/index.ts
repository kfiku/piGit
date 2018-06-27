import { MESSAGE } from '../constants/ActionTypes';


const actions = {
  message: (msg: string) => (
    { type: MESSAGE, msg }
  )
};

export default actions;
