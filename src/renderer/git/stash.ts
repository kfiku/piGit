import { IStash } from '../interfaces/IGit';
import { seq, filter, map } from '../utils/transducers';
import compose from '../utils/compose';
import exec from './exec';

export default async function stashList(dir, execFn = exec): Promise<IStash[]> {
  try {
    const cmd = `git stash list --pretty=format:%gd__%ai__%s`;
    const result = await execFn(dir, cmd);

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
