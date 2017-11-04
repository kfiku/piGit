import { keyframes } from 'styled-components';

export const defaultFont = 'Raleway, sans-serif';
// export const styledFont = 'Cutive', serif;
// export const styledFont = 'Eczar', serif;
export const styledFont = 'Copse, serif';
export const scriptFont = 'oraqle_scriptregular, serif';
// export const styled2Font = 'Trocchi', serif;
// export const styledFont = 'Trocchi', serif;

/* COLORS */
export const g0 = '#eee';
export const g1 = '#ddd';
export const g2 = '#ccc';
export const g3 = '#bbb';
export const g4 = '#888';
export const g5 = '#666';
export const g6 = '#444';
export const g7 = '#222';

export const red = '#800';
export const green = '#49963D';
export const orange = '#ce800b';
export const blue = '#1E3E7F';

export const redBg = '#f5d2ea';
export const orangeBg = '#e8ddcb';
export const blueBg = '#d9dff3';

/* SIZES */
export const lh = 16;
export const fileHeight = lh * 1.5;
export const br = lh / 4; // defaultBorderRadius

export const navHeight = 48;
export const groupHeaderHeight = 32;
export const resizerWidth = 4;

export const repoSize = 200;
export const repoBgSize = 65;
export const repoIconSize = 15;
export const repoDetailsMargin = 0;

export const spin = keyframes`
from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
