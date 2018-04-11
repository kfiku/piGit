import { IStatus, IFile, IFileType } from '../interfaces/IGit';
import { filter, map, transduce, seq, pushReducer, sumReducer } from '../utils/transducers';
import clone from '../helpers/Clone';
import compose from '../utils/compose';
import exec from './exec';
import stashList from './stash';

export function getEmptyStatus(): IStatus {
  return {
    branch: 'master',
    stats: {
      ahead: 0,
      behind: 0,
      added: 0,
      modified: 0,
      deleted: 0,
      renamed: 0,
      untracked: 0,
      conflicted: 0,
      stashes: 0,
    },
    lists: {
      staged: [],
      unstaged: [],
      conflicted: [],
      stashes: [],
    }
  };
}

export default async function status(dir, execFn = exec): Promise<IStatus> {
  try {
    const cmd = `git status --porcelain -b -u`;
    const result = await execFn(dir, cmd);
    const stashes = await stashList(dir, execFn);
    const lines = result ? result.split('\n').filter(s => !!s.trim()) : [];
    const isHeaderLine = ((line: string) => line && line.indexOf('##') !== -1);
    const headLine = lines.find(isHeaderLine);
    if (!headLine) {
      throw new Error(
        `Git status parsing error ("${result}")`
      );
    }
    const header = parseStatusHeader(headLine);
    const newStatus = getEmptyStatus();
    newStatus.branch = header.branch;

    const files = transduce(
      compose(
        filter((line: string) => !!line && !!line.trim()),
        filter((line: string) => !isHeaderLine(line)),
        map(parseFile)
      ),
      pushReducer,
      [],
      lines
    );

    newStatus.stats = {
      ...header.stats,
      modified: countTypeInFiles(filter(isModified), files),
      untracked: countTypeInFiles(filter(isUntracked), files),
      deleted: countTypeInFiles(filter(isDeleted), files),
      added: countTypeInFiles(filter(isAdded), files),
      renamed: countTypeInFiles(filter(isRenamed), files),
      conflicted: countTypeInFiles(filter(isConflicted), files),
      stashes: stashes.length,
    };

    newStatus.lists = {
      staged: seq(filter(isStaged), files),
      unstaged: seq(
        compose(
          filter(isUnstaged),
          map((file: IFile) => updateFileType(file, false))
        ),
        files),
      conflicted: seq(filter(isConflicted), files),
      stashes,
    };

    return newStatus;
  } catch (error) {
    throw error;
  }
}

function isModified(file: IFile) {
  return file.index === 'M' || file.workspace === 'M';
}

function isUntracked(file: IFile) {
  return file.index === '?' || file.workspace === '?';
}

function isDeleted(file: IFile) {
  return file.index === 'D' || file.workspace === 'D';
}

function isAdded(file: IFile) {
  return file.index === 'A' || file.workspace === 'A';
}

function isRenamed(file: IFile) {
  return file.index === 'R' || file.workspace === 'R';
}

function isConflicted(file: IFile) {
  return file.index === 'C' || file.workspace === 'C';
}

function isStaged(file: IFile) {
  return !!file.index && file.index !== '?';
}

function isUnstaged(file: IFile) {
  return !!file.workspace;
}

function boolTo01(bool: boolean): 1 | 0 {
  return bool ? 1 : 0;
}

const boolTo01Map = map(boolTo01);

function countTypeInFiles(filterFn, files: IFile[]) {
  return transduce(
    compose(
      filterFn,
      boolTo01Map
    ),
    sumReducer,
    0,
    files
  );
}

function parseStatusHeader(line: string) {
  // PARSE HEADER
  const aheadReg = /ahead (\d+)/;
  const behindReg = /behind (\d+)/;
  const currentReg = /^## *(.+?(?=(?:\.{3}|\s|$)))/;
  const trackingReg = /\.{3}(\S*)/;
  let regexResult;

  regexResult = aheadReg.exec(line);
  const ahead = regexResult && +regexResult[1] || 0;

  regexResult = behindReg.exec(line);
  const behind = regexResult && +regexResult[1] || 0;

  regexResult = currentReg.exec(line);
  const current = regexResult && regexResult[1];

  regexResult = trackingReg.exec(line);
  const tracking = regexResult && regexResult[1];

  return {
    branch: current + (tracking.indexOf(current) === -1 ? ' → ' + tracking : ''),
    stats: { ahead, behind }
  };
}

function parseFile(line: string): IFile {
  const file: IFile = {
    index: line[0].trim() as IFileType,
    workspace: line[1].trim() as IFileType,
    path: line.slice(3).trim(),
    type: '?',
    staged: false,
    conflicted: false
  };

  file.index = file.index === '?' ? '' : file.index;
  file.type = file.index || file.workspace;
  file.staged = isStaged(file);
  file.conflicted = isConflicted(file);

  return file;
}

function updateFileType(file: IFile, staged: boolean): IFile {
  const updatedFile = clone(file);
  updatedFile.type = staged ? file.index : file.workspace;
  return updatedFile;
}
