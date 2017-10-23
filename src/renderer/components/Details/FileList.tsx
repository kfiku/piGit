import * as React from 'react';
import styled from 'styled-components';

import File from './File';

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export default function FileList ({files}: { files: string[] }) {
  console.log(files);
  // return null;

  return (
    <Ul>
      {files.map(file =>
        <File key={file} file={file} />
      )}
    </Ul>
  );
  // const extName = extname(files).replace('.', '');
  // console.log(extName);
  // return (
  //   <Li key={ file } className={`${extName}-icon`}>
  //     { file }
  //   </Li>
  // );
}
