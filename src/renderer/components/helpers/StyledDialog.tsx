import styled from 'styled-components';

export const Dialog = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
`;

export const Content = styled.div`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  z-index: 101;
  padding: 16px;


  border-radius: $br * 2;
  background-color: white;

  p {
    margin-top: 0;
  }
`;

export const Bg = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
  background-color: rgba(10, 10, 10, 0.86);
`;
