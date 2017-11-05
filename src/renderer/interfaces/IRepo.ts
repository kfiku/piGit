import { IFile } from '../components/Details/File';
import { IStash } from '../components/Details/Stash';

export interface IRepo {
  id?: string;
  name?: string;
  branch?: string;
  dir?: string;
  ahead?: number;
  behind?: number;
  modified?: any[];
  staged?: IFile[];
  deleted?: any[];
  renamed?: any[];
  untracked?: string[];
  conflicted?: IFile[];
  unstaged?: IFile[];
  stashes?: IStash[];
  progressing?: boolean;
  lastUpdate?: number;
}
