import styled from 'styled-components';

import {
  repoSize,
} from '../../utils/styles';


// const StyledNav = styled('nav')`
const StyledRepos = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: ${repoSize / 2}px;
  margin-top: ${-repoSize / 8}px;

  /* SUPER SMALL SIZES */
  @media screen
  and (max-width: ${3 * repoSize - 1}px) {
    margin-top: 0;
  }


  ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
    `
      @media screen and (min-width: ${(i + 0.5) * repoSize}px)
        and (max-width: ${(i + 1.5) * repoSize - 1}px) {
          margin-bottom: ${100 / i / 2}%;
      }
    `
  ))}
`;

export default StyledRepos;
