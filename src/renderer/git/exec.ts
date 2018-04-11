import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const gitCommandsLog = [];

export default async function execFn(dir, cmd): Promise<string> {
  const fullCmd = `cd ${dir} && ${cmd}`;
  gitCommandsLog.push(fullCmd);
  return new Promise<string>((resolve, reject) => {
    exec(fullCmd, (err, data: string) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });

}
