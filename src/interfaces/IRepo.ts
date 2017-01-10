export interface IRepo {
  id: string;
  name?: string;
  branch?: string;
  dir?: string;
  ahead?: number;
  behind?: number;
  modified?: any[];
  added?: any[];
  progressing?: boolean;
  lastUpdate?: number;
}
