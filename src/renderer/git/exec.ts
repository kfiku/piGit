import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const gitCommandsLog = [];

export default async function execFn(dir, cmd): Promise<string> {
  gitCommandsLog.push(cmd);

  const { stdout, stderr } = await execPromise(
    `cd ${dir} && ${cmd}`
  );

  if (stderr) {
    throw new Error(stderr);
  }

  return stdout;
}
