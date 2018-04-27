import * as React from 'react';
import styled from 'styled-components';

import {
  navHeight, g4, g7, green,
  spin as spinAnimation,
  upAndDown as upAndDownAnimation
} from '../../utils/styles';

const StyledIcon = styled.i`
  vertical-align: top;
  display: inline-block;
  width: ${navHeight * 0.75}px;
  height: ${navHeight * 0.75}px;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    fill: ${g4};
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

    animation: ${spinAnimation} 1s linear infinite;
  }

  ${({ spin, upAndDown }: any) => {
    if (spin) {
      return `
        svg {
          fill: ${green};
        }

        animation: ${spinAnimation} 0.7s linear infinite;
      }
      `;
    }

    if (upAndDown) {
      return `
        overflow: hidden;
        svg {
          fill: ${green};
          animation: ${upAndDownAnimation} 0.5s linear infinite;
        }
      }
      `;
    }
  }}
` as any;

interface IconProps {
  spin?: boolean;
  upAndDown?: boolean;
  className?: string;
  title?: string;
  children?: any;
  onClick?: () => {};
}

function Icon ({ spin, upAndDown, className, title, onClick, children }: IconProps) {
  return (
    <StyledIcon
      onClick={onClick}
      spin={spin}
      upAndDown={upAndDown}
      className={className}
      title={title}
    >
      {children}
    </StyledIcon>
  );
}

export default Icon;
