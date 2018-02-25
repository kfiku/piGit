import * as React from 'react';

const RepoBg = ({ diamondOver, diamondOut, ...props }) => (
  <svg width='100' height='100' viewBox='0 0 26.458 26.458' {...props}>
    <rect
      onMouseEnter={diamondOver}
      onMouseLeave={diamondOut}
      width='19.87'
      height='19.87'
      x='200.076'
      y='181.367'
      ry='2'
      rx='2'
      transform='rotate(45 326.573 -135.27)'
    />
  </svg>
);

export default RepoBg;
