import * as React from 'react';
import styled from 'styled-components';

import { lh, g5, blue } from '../../utils/styles';

const Type = styled.span`
  width: ${lh}px;
  height: ${lh}px;
  line-height: ${lh}px;
  background: ${g5};
  color: white;
  text-align: center;
  font-size: ${lh * 0.65}px;
`;

const Modified = Type.extend`
  background: ${blue};
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

    default:
      break;
  }

  return (
    <Comp>{type}</Comp>
  );
}
