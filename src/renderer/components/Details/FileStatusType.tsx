import * as React from 'react';
import styled from 'styled-components';

import { lh, g5, blue, orange, red, green } from '../../utils/styles';

const Type = styled.span`
  width: ${lh}px;
  height: ${lh}px;
  line-height: ${lh}px;
  background: ${g5};
  color: white;
  text-align: center;
  font-size: ${lh * 0.65}px;
  border-radius: ${lh}px;
`;

const Modified = Type.extend`
  background: ${blue};
`;

const Added = Type.extend`
  background: ${green};
`;

const Deleted = Type.extend`
  background: ${red};
`;

const Renamed = Type.extend`
  background: ${orange};
`;

interface IType {
  type: string;
}

export default function FileStatusType ({type}: IType) {
  let Comp = Type;
  switch (type) {
    case 'M':
      Comp = Modified;
      break;
    case 'A':
      Comp = Added;
      break;
    case 'D':
      Comp = Deleted;
      break;
    case 'R':
      Comp = Renamed;
      break;

    default:
      break;
  }

  return (
    <Comp>{type}</Comp>
  );
}
