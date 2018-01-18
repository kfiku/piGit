import { IFile } from '../interfaces/IGit';

export interface IStash {
  message: string;
  date: string;
  id: string;
}

export interface IStatusStats {
  ahead: number;
  behind: number;
  modified: number;
  deleted: number;
  renamed: number;
  added: number;
  untracked: number;
  conflicted: number;
}


export type IFileType = '?' | 'M' | 'A' | 'D' | 'R' | 'U' | 'C' | '';

export interface IFile {
  path: string;
  type: IFileType;
  index?: IFileType;
  workspace?: IFileType;
  staged: boolean;
  conflicted: boolean;
}

export interface IStatus {
  branch: string;
  stats: IStatusStats;
  lists: {
    staged: IFile[];
    unstaged: IFile[];
    conflicted: IFile[];
  };
}
