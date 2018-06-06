import * as React from 'react';
import styled from 'styled-components';

import { lh, g2 } from '../../utils/styles';
import { IRepo } from '../../interfaces/IRepo';
import { IFile } from '../../interfaces/IGit';
import FileBox from './FileBox';
import BatchActions from './BatchActions';

export const Wrapper = styled.div`
`;

export const Header = styled.header`
  display: flex;
  margin: ${lh / 4}px 0;
  &:hover {
    background: ${g2};
  }
`;

export const Title = styled.h4`
  flex: 1;
  margin: 0;
  padding: ${lh / 3}px ${lh}px ${lh / 3}px ${lh / 2}px;
  font-size: ${lh * 0.75}px;
  text-transform: uppercase;
`;

export const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

interface IFileListProps {
  files: IFile[];
  title: string;
  repo: IRepo;
  alwaysShow?: boolean;
  type?: string;
}

export default function FileList ({ files, title, repo, alwaysShow, type }: IFileListProps) {
  if (!alwaysShow && files && files.length === 0) { return null; }

  return (
    <Wrapper>
      <Header>
        <Title>
          {title} ({files.length}):
        </Title>
        {files.length ?
          <BatchActions repo={repo} type={type} /> :
          null
        }
      </Header>
      {<Ul>
        {files.map(file =>
          <FileBox key={file.path} file={file} repo={repo} />
        )}
      </Ul>}
    </Wrapper>
  );
}
