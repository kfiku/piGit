import styled from 'styled-components';

import { groupHeaderHeight, g1, g6, g7, styledFont, scriptFont } from '../../utils/styles';

// const StyledNav = styled('nav')`
const StyledGroupHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* align-items: center; */
  flex-direction: column;
  // padding: ${groupHeaderHeight / 2}px 0;

  position: relative;
  z-index: 3;

  .icon {
    /* display: block; */
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
    display: block;
    flex-grow: 1;
    height: ${groupHeaderHeight * 2}px;
  }

  .title {
    cursor: text;
    display: block;
    width: 100%;
    height: ${groupHeaderHeight * 2}px;

    font-family: ${scriptFont};
    font-size: ${groupHeaderHeight * 2}px;
    line-height: ${groupHeaderHeight * 2}px;
    word-break: break-all;
    font-weight: 400;
    color: ${g6};
  }

  input.title {
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
    background: ${g1};

    max-width: 100%;
  }
`;

export default StyledGroupHeader;
