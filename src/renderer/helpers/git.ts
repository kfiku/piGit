import { exec } from 'child_process';
import * as promisify from 'es6-promisify';

import { IStash, IStatus } from '../interfaces/IGit';
// import { IFile } from '../interfaces/IGit';
// import { IRepo } from '../interfaces/IRepo';
import compose from '../utils/compose';
import { seq, filter, map, transduce, pushReducer } from '../utils/transducers';
const execPromise = promisify(exec);

const gitCommandsLog = [];
function logCmd (cmd) {
  gitCommandsLog.push(cmd);
  // console.log(cmd);
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

export async function status(dir, execFn = execPromise): Promise<IStatus> {
  try {
    const cmd = `git status --porcelain -b -u`;
    logCmd(cmd);
    const result = await execFn(
      `cd ${dir} && ${cmd}`
    );

    const lines = result.split('\n').filter(s => !!s.trim());
    const isHeaderLine = ((line: string) => line.indexOf('##') !== -1);
    const header = parseStatusHeader(
      lines.find(isHeaderLine)
    );
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

    console.log(header, files);

    // return { header, files };
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function stashList(dir, execFn = execPromise): Promise<IStash[]> {
  try {
    const cmd = `git stash list --pretty=format:%gd__%ai__%s`;
    logCmd(cmd);
    const result = await execFn(
      `cd ${dir} && ${cmd}`
    );

    const stashesList = seq(
      compose(
        map((s: string) => s.trim()),
        filter((s: string) => !!s && !!s.match(/.*__.*__.*/)),
        map((s: string) => {
          const stashArr = s.split('__');
          const stash: IStash = {
            id: stashArr[0],
            date: stashArr[1],
            message: stashArr[2]
          };

          return stash;
        })
      ),
      result.split('\n')
    );

    return stashesList;
  } catch (error) {
    console.log(error);
    return [];
  }
}
