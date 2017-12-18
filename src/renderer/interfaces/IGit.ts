import { IFile } from '../components/Details/File';

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
  untracked: number;
  conflicted: number;
}

export interface IFile {
  path: string;
  type: '?' | 'M' | 'A' | 'D' | 'R' | 'U' | 'C';
  staged: boolean;
  conflicted: boolean;
}

export interface IStatus {
  stats: IStatusStats;
  lists: {
    staged: IFile[];
    unstaged: IFile[];
    conflicted: IFile[];
  };
}
