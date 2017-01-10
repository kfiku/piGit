import { IRepo } from './IRepo';

export interface IGroup {
  id: string;
  title: string;
  editing: boolean;
  confirmDelete: boolean;
  repos: string[];
}
