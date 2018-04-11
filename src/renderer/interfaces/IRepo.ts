import { IFile, IStash, IStatusStats } from '../interfaces/IGit';

export interface IRepoStats extends IStatusStats {}
export interface IRepo {
  id: string;
  name: string;
  branch: string;
  dir: string;
  progressing: boolean;
  stats: IRepoStats;
  lists: {
    staged: IFile[];
    unstaged: IFile[];
    conflicted: IFile[];
    stashes: IStash[];
  };
}
