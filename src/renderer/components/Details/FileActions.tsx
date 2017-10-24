import * as React from 'react';
import styled from 'styled-components';

import { IFile } from './File';
import { lh, g5, red } from '../../utils/styles';

const Action = styled.span`
  width: ${lh * 1.25}px;
  height: ${lh * 1.25}px;
  margin-right: ${lh / 4}px;
  color: ${g5};
  text-align: center;
  font-size: ${lh}px;
  font-weight: 700;

  cursor: pointer;

  &:hover {
    color: ${red};
  }
`;

const Wrapper = styled.div`
  display: none;
`;

interface IFileActions {
  file: IFile;
  className: string;
}

export default function FileActions ({file, className}: IFileActions) {
  if (file.staged) {
    return (
      <Wrapper className={className}>
        <Action>
          ‒
        </Action>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={className}>
      <Action>⮌</Action>
      <Action>🞡</Action>
    </Wrapper>
  );
}
