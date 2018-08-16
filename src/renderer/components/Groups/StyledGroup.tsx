import styled from 'styled-components';

// import { groupHeaderHeight, g1, g6, g7, styledFont, scriptFont } from '../../utils/styles';

// const StyledNav = styled('nav')`
const StyledGroup = styled.div`
  width: 300px;
  padding-right: 20px;
  margin-right: 20px;
  border-right: 2px dotted gray;

  &:last-child {
    border-right: none;
  }
`;

export default StyledGroup;
