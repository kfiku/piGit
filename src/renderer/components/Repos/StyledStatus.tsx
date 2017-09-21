import styled from 'styled-components';

import {
  lh,
  red,
  orange,
  green,
  blue, g4, styledFont
} from '../../utils/styles';

export const Ahead = styled.span`
  color: ${orange};
  :after {
    content: '↑ ';
    // content: '↓↑×→'
  }
`;

export const Behind = styled.span`
  color: ${red};
  :after {
    content: '↓ ';
  }
`;

export const Modified = styled.span`
  color: ${blue};

  :before {
    content: '+ ';
  }
`;

export const Untracked = styled.span`
  color: ${g4};
`;

export const Deleted = styled.span`
  color: ${orange};

  :before {
    content: ' ×';
  }
`;

export const Renamed = styled.span`
  color: ${green};

  :before {
    content: ' →';
  }
`;

// const StyledNav = styled('nav')`
const StyledStatus = styled.div`
  font-family: ${styledFont};
  // font-family: sans-serif;
  font-size: ${lh}px;

  &:empty {
    &:after {
      content: '✔';
      color: ${green};
    }
  }
`;

export default StyledStatus as any;
