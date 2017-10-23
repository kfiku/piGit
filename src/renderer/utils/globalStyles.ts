// import { injectGlobal } from 'styled-components';

import { g3, navHeight, defaultFont } from './styles';

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
    width: 5px;
    height: 100%;
    bottom: 0;
    right: 0;
    background: gray;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: col-resize;
  }
`;
