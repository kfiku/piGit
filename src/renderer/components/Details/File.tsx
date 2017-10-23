import * as React from 'react';
import { basename } from 'path';
import styled from 'styled-components';
const fileIcons = require('file-icons-js');

import { lh, g5 } from '../../utils/styles';

const Icon = styled.i`
  margin-right: ${lh / 2}px;

  &:before {
    font-size: ${lh * 1.125}px;
    display: inline-block;
    vertical-align: middle;
    font-style: normal;
  }
`;

const FileName = styled.span`
  display: inline-block;
  margin-right: ${lh / 2}px;
  font-size: ${lh * 0.75}px;
  font-weight: 700;
`;

const FilePath = FileName.extend`
  font-size: ${lh * 0.65}px;
  font-weight: 300;
  color: ${g5};

  flex: 1;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Li = styled.li`
  display: flex;
`;

const Type = styled.span`
  width: ${lh}px;
  height: ${lh}px;
  line-height: ${lh}px;
  background: ${g5};
  color: white;
  text-align: center;
  font-size: ${lh * 0.65}px;
`;


export interface IFile {
  path: string;
  type: string;
}
interface IFileComp {
  file: IFile;
}

export default function File ({file}: IFileComp) {
  const baseName = basename(file.path);
  const className = fileIcons.getClassWithColor(baseName);
  return (
    <Li title={file.path}>
      <Icon className={className} />
      <FileName>{ baseName }</FileName>
      <FilePath>{ file.path !== baseName ? file.path : '' }</FilePath>
      <Type>{ file.type }</Type>
    </Li>
  );
}
