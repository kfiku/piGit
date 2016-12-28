import { IRepo } from './IRepo';

export interface IGroup {
  id: '';
  title: 'default';
  editing: false;
  confirmDelete: false;
  repos: IRepo[];
}
