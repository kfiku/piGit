import * as React from 'react';
import { basename } from 'path';
import styled from 'styled-components';
const fileIcons = require('file-icons-js');

import { lh, g5 } from '../../utils/styles';

const Icon = styled.i`
  margin-right: ${lh / 2}px;

  &:before {
    display: inline-block;
    font-style: normal;
    font-size: 20px !important;
    vertical-align: bottom;
  }
`;

const FileName = styled.span`
  display: inline-block;
  margin-right: ${lh / 2}px;
`;

const FilePath = FileName.extend`
  font-size: ${lh * 0.75}px;
  color: ${g5};
`;

const Li = styled.li`
  margin: ${lh / 2}px ${lh}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  & > * {
    vertical-align: middle;
  }
`;

export default function File ({file}: { file: string }) {
  const baseName = basename(file);
  const className = fileIcons.getClassWithColor(baseName);
  return (
    <Li title={file}>
      <Icon className={className} />
      <FileName>{ baseName }</FileName>
      <FilePath>{ file }</FilePath>
    </Li>
  );
}
