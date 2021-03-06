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

export const Conflicted = styled.span`
  color: ${red};

  :before {
    content: '✖ ';
  }
`;

export const Untracked = styled.span`
  color: ${g4};

  :before {
    content: ' ?';
  }
`;

export const Deleted = styled.span`
  color: ${orange};

  :before {
    content: ' ×';
  }
`;

export const Stashes = styled.span`
  color: ${blue};

  :before {
    content: ' ⚑';
  }
`;

export const Renamed = styled.span`
  color: ${green};

  :before {
    content: ' →';
  }
`;

// const StyledNav = styled('nav')`
const StyledStats = styled.div`
  font-family: ${styledFont};
  // font-family: sans-serif;
  font-size: ${lh}px;
  display: ${(p: any) => p.inline ? 'inline-block' : 'block'};
  margin-left: ${(p: any) => p.inline ? '12px' : '0'};

  &:empty {
    &:after {
      content: '✔';
      color: ${green};
    }
  }
`;

export default StyledStats as any;
