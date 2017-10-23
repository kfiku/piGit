export interface IRepo {
  id: string;
  name?: string;
  branch?: string;
  dir?: string;
  ahead?: number;
  behind?: number;
  modified?: any[];
  staged?: any[];
  deleted?: any[];
  renamed?: any[];
  untracked?: any[];
  unstaged?: any[];
  progressing?: boolean;
  lastUpdate?: number;
}
