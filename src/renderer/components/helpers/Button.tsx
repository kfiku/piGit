import styled from 'styled-components';
import { navHeight, g1, g2, g4, g7, defaultFont } from '../../utils/styles';

// const StyledNav = styled('nav')`
const Button = styled.button`
  padding: 0 ${navHeight / 4}px;
  height: ${navHeight}px;
  line-height: ${navHeight}px;
  vertical-align: middle;
  border: none;
  background: ${g2};
  outline: none;

  cursor: pointer;

  font-family: ${defaultFont};
  font-size: ${navHeight / 3}px;

  will-change: background;
  transition: background 0.3s;

  white-space: nowrap;

  & > i {
    margin: ${navHeight * 0.125}px ${navHeight / 4}px 0 0;
  }

  & > svg {
    margin: ${navHeight * 0.175}px 0 0 0;
  }

  svg {
    fill: ${g4};
  }

  &:hover {
    background: ${g1};

    svg {
      fill: ${g7};
    }
  }
`;

export default Button;
