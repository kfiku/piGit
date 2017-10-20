// import { injectGlobal } from 'styled-components';

import { g3, navHeight, defaultFont } from './styles';

export default `
  @font-face {
    font-family: 'oraqle_scriptregular';
    src: url('/fonts/oraqle_script-webfont.woff2') format('woff2');
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
`;
