// import { injectGlobal } from 'styled-components';

import { g3, g2, navHeight, resizerWidth, defaultFont } from './styles';

export default `
  @font-face {
    font-family: 'oraqle_scriptregular';
    src: url('fonts/oraqle_script-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html,
  body {
    height: 100%;
    margin: 0;
    background: ${g3};
    font-family: ${defaultFont};
    font-size: 16px;
  }

  *, *:after, *:before {
    box-sizing: border-box;
  }

  .nav-h {
    height: ${navHeight}px;
  }

  .react-resizable {
    position: relative;
    overflow: hidden;
  }

  .react-resizable-handle {
    position: absolute;
    width: ${resizerWidth}px;
    height: 100%;
    bottom: 0;
    right: 0;
    background: ${g2};
    padding: 0;
    margin: 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: col-resize;
    border: none;
    border-right: 1px solid ${g3};
  }

  [draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }
`;
