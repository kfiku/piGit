import * as React from 'react';
import { readFileSync } from 'fs';

import { renderLog } from '../../helpers/logger';

interface IsvgProps {
 src: string;
}

const Isvg: React.SFC<IsvgProps> = ({ src, ...rest }) => {
  renderLog('Isvg src=' + src);
  const svg = readFileSync('./src/svg/' + src).toString().replace('<?xml version="1.0" encoding="iso-8859-1"?>', '');
  return (
    <div {...rest} dangerouslySetInnerHTML={svg}>
      {src}
    </div>
  );
};

export default Isvg;
