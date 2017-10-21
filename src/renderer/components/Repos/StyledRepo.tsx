import styled from 'styled-components';

import {
  redBg,
  orangeBg,
  blueBg,
  repoSize,
  repoIconSize,
  styledFont,
  repoBgSize,
  g0, g3, g4, g5
} from '../../utils/styles';

const iconCenter = 50 - repoIconSize / 2;
const iconSide = (100 - repoBgSize) / 4;

// const StyledNav = styled('nav')`
const StyledGroupHeader = styled.div`
  width: ${repoSize}px;
  position: relative;

  &:hover {
    z-index:4;
  }

  &:hover,
  &.progressing {
    .icon {
      opacity: 1;
    }
  }

  .icon {
    position: absolute;
    z-index: 2;
    display: block;
    width: ${repoIconSize}%;
    height: ${repoIconSize}%;

    opacity: ${(p: any) => p.processing ? 1 : 0};
    will-change: opacity;
    transition: opacity 0.3s;
  }

  svg {
    fill: ${g3};
  }

  .icon-move {
    // top: (100% - $repo-bg-size) / 4;
    // left: 50% - $repo-icon-size / 2;
    top: ${iconSide}%;
    left: ${iconCenter}%;
    cursor: move;
  }

  .icon-refresh {
    bottom: ${iconSide}%;
    left: ${iconCenter}%;
  }

  .icon-pull,
  .icon-push {
    top: ${iconCenter}%;
    left: ${iconSide}%;
  }

  .icon-push {
    transform: rotate(180deg);
  }

  .icon-x {
    top: ${iconCenter}%;
    right: ${iconSide}%;
  }

  .content {
    position: absolute;
    z-index: 1;
    text-align: center;

    // CENTERING
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & > div {
      margin: 4px 0;
    }
  }

  .title {
    font-family: ${styledFont};
    margin-top: ${repoSize / 3.5}px;
    font-size: 1em;
    line-height: 1em;
    word-break: break-all;
    cursor: pointer;
  }

  .branch {
    font-size: 0.75em;
    color: ${g4};
  }

  .updated {
    font-size: 0.75em;
    color: ${g4};
  }

  &:after {
    content: '';
    position: absolute;
    top: ${(100 - repoBgSize) / 2}%;
    left: ${(100 - repoBgSize) / 2}%;
    display: block;
    z-index: 0;
    transform: rotate(45deg);
    width: ${repoBgSize}%;
    height: ${repoBgSize}%;
    border-radius: ${repoBgSize / 5}%;

    background: ${g0};

    will-change: background;
    transition: background 1s;
  }

  &.behind:after {
    background: ${redBg};
  }

  &.ahead:after {
    background: ${orangeBg};
  }

  &.modified:after {
    background: ${blueBg};
  }

  &.sortable-ghost:after {
    border: 2px dashed ${g5};
  }

  &.sortable-fallback {
    margin-left: 0 !important;

    &:after {
      box-shadow: 0 3px 20px rgba(black, 0.3);
    }
  }

  ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
    `
      @media screen and (min-width: ${(i + 0.5) * repoSize}px)
      and (max-width: ${(i + 1.5) * repoSize - 1}px) {
        width: ${100 / i}%;
        padding-bottom: ${100 / i}%;
        margin-bottom: -${100 / i / 2}%;

        &:nth-of-type(${(i + i - 1)}n + ${i + 1}) {
          margin-left: ${100 / i / 2}%;
        }
      }
    `
  ))}
`;

export default StyledGroupHeader as any;
