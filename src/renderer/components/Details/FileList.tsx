import * as React from 'react';
import styled from 'styled-components';

import { lh } from '../../utils/styles';
import File, { IFile } from './File';

const Wrapper = styled.div`
  padding: ${lh / 3}px ${lh}px ${lh / 3}px ${lh / 2}px;
`;

const Title = styled.h4`
  margin: ${lh / 4}px 0;
  font-size: ${lh * 0.75}px;
  text-transform: uppercase;
`;

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export default function FileList ({files, title}: { files: IFile[], title: string }) {
  return (
    <Wrapper>
      <Title>{title} ({files && files.length}): </Title>
      {<Ul>
        {files && files.map(file =>
          <File key={file.path} file={file} />
        )}
      </Ul>}
    </Wrapper>
  );
}
