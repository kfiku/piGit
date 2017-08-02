import styled from 'styled-components';
import * as PropTypes from 'prop-types';

import { navHeight, g2, g1, g7, green, spin, defaultFont } from '../../utils/styles';

const Icon = styled.i`
  vertical-align: top;
  display: inline-block;
  width: ${navHeight * 0.75}px;
  height: ${navHeight * 0.75}px;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    fill: $g4;
    will-change: fill;
    transition: fill 0.4s;
  }

  &:hover {
    svg { fill: ${g7}; }
  }

  &.icon-x {
    &:hover {
      svg {
        fill: $red;
      }
    }
  }

  .progressing > & {
    svg {
      fill: ${green};
    }

    animation: ${spin} 1s linear infinite;
  }

  ${(p: any) => p.spin ? `
    svg {
      fill: ${green};
    }

    animation: ${spin} 1s linear infinite;
  }
  `
  : null}
`;

Icon.propTypes = {
  spin: PropTypes.bool,
};

export default Icon as any;
