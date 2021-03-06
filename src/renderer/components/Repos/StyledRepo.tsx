import styled, { css } from 'styled-components';

import {
  repoSize
} from '../../utils/styles';

// const StyledNav = styled('nav')`
const StyledRepo = styled.div`
  width: ${repoSize}px;
  position: relative;
  pointer-events: none;
`;

const StyledRepoWithMQ = styled(StyledRepo)`
  ${[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => {
    /* Size of repo in percent (i and half in line) */
    const size = 100 / (i + 0.6);
    const inLine = i + i;
    const smallSize = 50;
    return css`
      /* SIZES 4 - 18 REPOS PER LINE */
      @media screen
      and (min-width: ${(i + 1) * repoSize}px)
      and (max-width: ${(i + 2) * repoSize - 1}px) {
        width: ${size}vw;
        height: ${size}vw;
        padding-bottom: ${size}vw;
        margin-right: -${size / 2}vw;
        margin-bottom: -${size / 2}vw;

        &:nth-child(even) {
          margin-top: ${size / 2}vw;
        }

        &:nth-of-type(${inLine}n + ${inLine}) {
          margin-right: 0;
        }
      }

      /* SUPER SMALL SIZES */
      @media screen
      and (max-width: ${3 * repoSize - 1}px) {
        width: ${smallSize}vw;
        height: ${smallSize}vw;

        &:after {
          top: ${5}%;
          left: ${5}%;
          transform: rotate(0);
          width: ${90}%;
          height: ${90}%;
        }
      }
    `;
  })}
`;

export default StyledRepoWithMQ as any;
