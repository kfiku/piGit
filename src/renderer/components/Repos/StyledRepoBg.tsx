import styled from 'styled-components';

import {
  redBg,
  orangeBg,
  blueBg,
  g0
} from '../../utils/styles';


import RepoBg from '../Icons/RepoBg';

const size = 86;
const StyledRepoBg = styled(RepoBg)`
  position: absolute;
  fill: ${g0};
  opacity: ${p => p.active ? 1 : 0.7};
  width: ${size}%;
  height: ${size}%;
  top: ${(100 - size) / 2}%;
  left: ${(100 - size) / 2}%;

  will-change: opacity;
  transition: opacity 0.3s;

  &.behind {
    fill: ${redBg};
  }

  &.ahead {
    fill: ${orangeBg};
  }

  &.modified {
    fill: ${blueBg};
  }

  rect {
    pointer-events: all;
  }
`;
export default StyledRepoBg as any;
