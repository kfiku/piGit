import styled from 'styled-components';

import { groupHeaderHeight, g1, g6, g7, styledFont, scriptFont } from '../../utils/styles';

// const StyledNav = styled('nav')`
const StyledGroupHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  // padding: ${groupHeaderHeight / 2}px 0;
  height: ${groupHeaderHeight * 2}px;

  position: relative;
  z-index: 3;

  &.editing {
    background: ${g1};
  }

  .icon {
    display: block;
    width: ${groupHeaderHeight}px;
    height: ${groupHeaderHeight}px;
    margin-right: ${groupHeaderHeight / 2}px;

    &:first-child {
      margin-left: ${groupHeaderHeight / 2}px;
    }
  }

  .icon-move {
    cursor: move;
  }

  .title-box {
    flex-grow: 1;
  }

  .title {
    height: ${groupHeaderHeight}px;

    font-size: ${groupHeaderHeight}px;
    line-height: ${groupHeaderHeight}px;

    font-family: ${styledFont};
    word-break: break-all;
    font-weight: 400;

    color: ${g7};
  }

  .title {
    height: ${groupHeaderHeight * 2}px;
    font-family: ${scriptFont};
    font-size: ${groupHeaderHeight * 2}px;
    color: ${g6};
  }

  input.title {
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
    background: none;

  }
`;

export default StyledGroupHeader;
