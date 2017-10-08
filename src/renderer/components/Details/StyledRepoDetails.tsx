import styled from 'styled-components';

import {
  red,
  orange,
  green,
  blue,
  lh,
  g0,
  repoDetailsMargin, navHeight
} from '../../utils/styles';


// const StyledNav = styled('nav')`
const StyledGroupHeader = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  // top: ${repoDetailsMargin + navHeight}px;
  top: 0;
  bottom: ${repoDetailsMargin}px;
  left: ${repoDetailsMargin}px;
  right: ${repoDetailsMargin}px;
  overflow: hidden;
  z-index: 10;

  // padding: ${lh}px;

  background: ${g0};

  .header,
  .status {
    margin-top: 0;
  }

  .icon {
    width: ${lh * 2}px;
    height: ${lh * 2}px;
  }

  .icon-x {
    position: absolute;
    top: ${lh}px;
    right: ${lh}px;
  }

  .content {
    overflow-y: auto;
    flex-grow: 1;
  }

  .status {
    .ahead {
      color: ${orange};
    }

    .behind {
      color: ${red};
    }

    .modified {
      color: ${blue};
    }

    &:empty {
      &:after {
        content: 'clean';
        color: ${green};
      }
    }
  }

  .footer {
    bottom: 0;
  }

  .diff {
    position: relative;
  }
`;

export default StyledGroupHeader as any;
