import { exec } from 'child_process';
import * as promisify from 'es6-promisify';

import { IStash } from '../interfaces/IGit';
// import { IFile } from '../components/Details/File';
// import { IRepo } from '../interfaces/IRepo';
import compose from '../utils/compose';
import { seq, filter, map } from '../utils/transducers';
const execPromise = promisify(exec);

const gitCommandsLog = [];
function logCmd (cmd) {
  gitCommandsLog.push(cmd);
  // console.log(cmd);
}

export async function status(dir, execFn = execPromise): Promise<IStash[]> {
  try {
    const cmd = `git status --porcelain -b -u`;
    logCmd(cmd);
    const stashes2 = await execFn(
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
      stashes2.split('\n')
    );

    return stashesList;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function stashList(dir, execFn = execPromise): Promise<IStash[]> {
  try {
    const cmd = `git stash list --pretty=format:%gd__%ai__%s`;
    logCmd(cmd);
    const stashes = await execFn(
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
      stashes.split('\n')
    );

    return stashesList;
  } catch (error) {
    console.log(error);
    return [];
  }
}
