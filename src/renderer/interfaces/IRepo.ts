import { IFile, IStash } from '../interfaces/IGit';

export interface IRepoStats {
  ahead: number;
  behind: number;
  modified: number;
  deleted: number;
  renamed: number;
  untracked: number;
  conflicted: number;
  stashes: number;
}

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
