import * as React from 'react';
import { basename, dirname } from 'path';
import styled from 'styled-components';
const fileIcons = require('file-icons-js');

import { IRepo } from '../../interfaces/IRepo';
import { IFile } from '../../interfaces/IGit';
import { lh, fileHeight, g5, g2 } from '../../utils/styles';
import Type from './FileStatusType';
import Actions from './FileActions';

import '../../css/file-icons.css';

const Icon = styled.i`
  width: ${lh * 1.25}px;
  margin-right: ${lh / 2}px;

  &:before {
    width: 100%;
    font-size: ${lh * 1.125}px !important;
    display: inline-block;
    vertical-align: middle;
    font-style: normal;
    text-align: center;
  }
`;


export const FileName = styled.span`
  flex: 1;
  margin-right: ${lh / 2}px;
  display: inline-block;
  font-size: ${lh * 0.75}px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FilePath = styled.span`
  margin-left: ${lh / 2}px;
  font-size: ${lh * 0.65}px;
  font-weight: 300;
  color: ${g5};
`;

export const Li = styled.li`
  display: flex;
  align-items: center;
  height: ${fileHeight}px;
  padding: 0 ${lh}px 0 ${lh / 2}px;

  &.selected {
    background: ${g2};
  }

  &:hover {
    background: ${g2};
    .file-actions{
      display: block;
    }
  }
`;

export type fileFn = (id: string, dir: string, file: string) => void;
export interface IFileProps {
  file: IFile;
  repo: IRepo;
  addFile: fileFn;
  unAddFile: fileFn;
  checkoutFile: fileFn;
  deleteFile: fileFn;
  selected: boolean;
  showFile: (file: IFile) => void;
}

export default function File ({
  file, repo, selected,
  addFile, unAddFile, checkoutFile, deleteFile, showFile
}: IFileProps) {
  if (!file || !file.path) { return null; }

  const baseName = basename(file.path);
  const dirName = dirname(file.path);
  const className = fileIcons.getClassWithColor(baseName);

  return (
    <Li title={file.path} className={selected ? 'selected' : undefined}>
      <Icon className={className} />

      <FileName onClick={() => showFile(file)}>
        { baseName }
        <FilePath>{ dirName }</FilePath>
      </FileName>

      <Actions
        className='file-actions'
        file={file} repo={repo}
        addFile={addFile}
        unAddFile={unAddFile}
        checkoutFile={checkoutFile}
        deleteFile={deleteFile}
      />
      <Type type={ file.type } />
    </Li>
  );
}
