import { IStatus } from '../interfaces/IGit';
import { filter, map, transduce, pushReducer } from '../utils/transducers';
import compose from '../utils/compose';
import exec from './exec';

export function getEmptyStatus(): IStatus {
  return {
    branch: 'master',
    stats: {
      ahead: 0,
      behind: 0,
      modified: 0,
      deleted: 0,
      renamed: 0,
      untracked: 0,
      conflicted: 0
    },
    lists: {
      staged: [],
      unstaged: [],
      conflicted: []
    }
  };
}

export default async function status(dir, execFn = exec): Promise<IStatus> {
  try {
    const cmd = `git status --porcelain -b -u`;
    const result = await execFn(dir, cmd);

    const lines = result.split('\n').filter(s => !!s.trim());
    const isHeaderLine = ((line: string) => line && line.indexOf('##') !== -1);
    const headLine = lines.find(isHeaderLine);
    if (!headLine) {
      throw new Error(
        `Git status parsing error ("${result}")`
      );
    }
    const header = parseStatusHeader(headLine);
    const files = transduce(
      compose(
        filter((line: string) => !!line && !!line.trim()),
        filter((line: string) => !isHeaderLine(line)),
        map(parseFile)
      ),
      pushReducer,
      [],
      lines
    );

    // console.log(header, files);

    const newStatus = getEmptyStatus();
    newStatus.stats = { ...newStatus.stats, ...header.stats };

    return newStatus;
  } catch (error) {
    throw error;
  }
}

function parseStatusHeader(line: string) {
  // PARSE HEADER
  const aheadReg = /ahead (\d+)/;
  const behindReg = /behind (\d+)/;
  const currentReg = /^## *(.+?(?=(?:\.{3}|\s|$)))/;
  const trackingReg = /\.{3}(\S*)/;
  let regexResult;

  regexResult = aheadReg.exec(line);
  const ahead = regexResult && +regexResult[1] || 0;

  regexResult = behindReg.exec(line);
  const behind = regexResult && +regexResult[1] || 0;

  regexResult = currentReg.exec(line);
  const current = regexResult && regexResult[1];

  regexResult = trackingReg.exec(line);
  const tracking = regexResult && regexResult[1];

  return {
    branch: current + (tracking.indexOf(current) === -1 ? ' → ' + tracking : ''),
    stats: { ahead, behind }
  };
}

function parseFile(line: string) {
  const index = line[0];
  const workspace = line[1];
  const file = line.slice(3).trim();

  return { [`file_${file}`]: { index, workspace, file } };
}
