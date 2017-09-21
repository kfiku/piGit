// import { injectGlobal } from 'styled-components';

import { g3, navHeight, defaultFont } from './styles';

export default `
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
