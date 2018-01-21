import status, { getEmptyStatus } from '../status';

describe('status', () => {
  it('should throw with empty status', (done) => {
    status('dir', () => Promise.resolve(''))
      .catch(e => {
        expect(e).toBeDefined();
        done();
      });
  });

  it('should work with clean status', (done) => {
    status('dir', () => Promise.resolve(
      '## master...origin/master'
    ))
      .then(st => {
        expect(st).toEqual(getEmptyStatus());
        done();
      });
  });

  it('should work with behind 6', (done) => {
    status('dir', () => Promise.resolve(
      '## master...origin/master [behind 6]'
    ))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.behind = 6;
        expect(st).toEqual(expected);
        done();
      });
  });

  it('should work with behind 6, ahead 2, new-feature', (done) => {
    status('dir', () => Promise.resolve(
      '## new-feature...origin/new-feature [behind 6] [ahead 2]'
    ))
      .then(st => {
        const expected = getEmptyStatus();
        expected.branch = 'new-feature';
        expected.stats.behind = 6;
        expected.stats.ahead = 2;
        expect(st).toEqual(expected);
        done();
      });
  });

  it('should work with behind 6, ahead 2, new-feature2 → new-feature', (done) => {
    status('dir', () => Promise.resolve(
      '## new-feature2...origin/new-feature [behind 6] [ahead 2]'
    ))
      .then(st => {
        const expected = getEmptyStatus();
        expected.branch = 'new-feature2 → origin/new-feature';
        expected.stats.behind = 6;
        expected.stats.ahead = 2;
        expect(st).toEqual(expected);
        done();
      });
  });

  it('should work fine with untracked', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
?? test/git.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.untracked = 1;
        expected.lists.unstaged = [{
          path: 'test/git.test.ts', type: '?', staged: false, conflicted: false,
          index: '', workspace: '?'
        }];
        expect(st).toEqual(expected);
        done();
      });
  });

  it('should work fine with modified workspace', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
 M test/git.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.modified = 1;
        expected.lists.unstaged = [{
          path: 'test/git.test.ts', type: 'M', staged: false, conflicted: false,
          index: '', workspace: 'M'
        }];
        expect(st).toEqual(expected);
        done();
      });
  });
  it('should work fine with modified index', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
M  test/git.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.modified = 1;
        expected.lists.staged = [{
          path: 'test/git.test.ts', type: 'M', staged: true, conflicted: false,
          index: 'M', workspace: ''
        }];
        expect(st).toEqual(expected);
        done();
      });
  });

  it('should work fine with added', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
A  test/git.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.added = 1;
        expected.lists.staged = [{
          path: 'test/git.test.ts', type: 'A',
          staged: true, conflicted: false,
          index: 'A', workspace: ''
        }];
        expect(st).toEqual(expected);
        done();
      });
  });

  it('should work fine with deleted workspace', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
 D test/git.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.deleted = 1;
        expected.lists.unstaged = [{
          path: 'test/git.test.ts', type: 'D',
          staged: false, conflicted: false,
          index: '', workspace: 'D'
        }];
        expect(st).toEqual(expected);
        done();
      });
  });

  it('should work fine with deleted index', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
D  test/git.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.deleted = 1;
        expected.lists.staged = [{
          path: 'test/git.test.ts', type: 'D',
          staged: true, conflicted: false,
          index: 'D', workspace: ''
        }];
        expect(st).toEqual(expected);
        done();
      });
  });
  it('should work fine with renamed', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
R  test/git.test.ts -> test/git2.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.renamed = 1;
        expected.lists.staged = [{
          path: 'test/git.test.ts -> test/git2.test.ts', type: 'R',
          staged: true, conflicted: false,
          index: 'R', workspace: ''
        }];
        expect(st).toEqual(expected);
        done();
      });
  });
  it('should work fine with modified index and workspace', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
MM test/git.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.modified = 1;
        expected.lists.staged = [{
          path: 'test/git.test.ts', type: 'M',
          staged: true, conflicted: false,
          index: 'M', workspace: 'M'
        }];
        expected.lists.unstaged = [{
          path: 'test/git.test.ts', type: 'M',
          staged: true, conflicted: false,
          index: 'M', workspace: 'M'
        }];
        expect(st).toEqual(expected);
        done();
      });
  });
  it('should work fine with added index and modified in workspace', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
AM test/git.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.added = 1;
        expected.stats.modified = 1;
        expected.lists.staged = [{
          path: 'test/git.test.ts', type: 'A',
          staged: true, conflicted: false,
          index: 'A', workspace: 'M'
        }];
        expected.lists.unstaged = [{
          path: 'test/git.test.ts', type: 'M',
          staged: true, conflicted: false,
          index: 'A', workspace: 'M'
        }];
        expect(st).toEqual(expected);
        done();
      });
  });
  it('should work fine with added index and modified in workspace', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
RM test/git.test.ts -> test/git2.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.renamed = 1;
        expected.stats.modified = 1;
        expected.lists.staged = [{
          path: 'test/git.test.ts -> test/git2.test.ts', type: 'R',
          staged: true, conflicted: false,
          index: 'R', workspace: 'M'
        }];
        expected.lists.unstaged = [{
          path: 'test/git.test.ts -> test/git2.test.ts', type: 'M',
          staged: true, conflicted: false,
          index: 'R', workspace: 'M'
        }];
        expect(st).toEqual(expected);
        done();
      });
  });
  it('should work fine with added index and modified in workspace', (done) => {
    status('dir', () => Promise.resolve(`
## master...origin/master
RD test/git.test.ts -> test/git2.test.ts
    `))
      .then(st => {
        const expected = getEmptyStatus();
        expected.stats.renamed = 1;
        expected.stats.deleted = 1;
        expected.lists.staged = [{
          path: 'test/git.test.ts -> test/git2.test.ts', type: 'R',
          staged: true, conflicted: false,
          index: 'R', workspace: 'D'
        }];
        expected.lists.unstaged = [{
          path: 'test/git.test.ts -> test/git2.test.ts', type: 'D',
          staged: true, conflicted: false,
          index: 'R', workspace: 'D'
        }];
        expect(st).toEqual(expected);
        done();
      });
  });
// '?' | 'M' | 'A' | 'D' | 'R' | 'U' | 'C' | '';


//   it('should work fine with some status', (done) => {
//     status('dir', () => Promise.resolve(`
// ## master...origin/master [ahead 2]
// MM GitRepos.ts
// AM git.ts
// D  icon.ts
// R  focused.ts -> isAppFocused.ts
//  M transducers.ts
// ?? icons.ts
// ?? test/git.test.ts
//     `))
//       .then(st => {
//         expect(st).toEqual({
//           branch: 'master',
//           stats: {
//             ahead: 2,
//             behind: 0,
//             modified: 3,
//             deleted: 1,
//             renamed: 1,
//             added: 1,
//             untracked: 2,
//             conflicted: 0
//           },
//           lists: {
//             staged: [
//               { path: 'GitRepos.ts', type: 'M', staged: true, conflicted: false,
//                 index: 'M', workspace: 'M' },
//               { path: 'git.ts', type: 'A', staged: true, conflicted: false,
//                 index: 'M', workspace: 'M' },
//               { path: 'icon.ts', type: 'D', staged: true, conflicted: false,
//                 index: 'M', workspace: 'M' },
//               { path: 'isAppFocused.ts', type: 'R', staged: true, conflicted: false,
//                 index: 'M', workspace: 'M' }
//             ],
//             unstaged: [
//               { path: 'icons.ts', type: '?', staged: false, conflicted: false,
//                 index: 'M', workspace: 'M' },
//               { path: 'git.ts', type: 'M', staged: false, conflicted: false,
//                 index: 'M', workspace: 'M' },
//               { path: 'test/git.test.ts', type: '?', staged: false, conflicted: false,
//                 index: '?', workspace: '?' },
//             ],
//             conflicted: []
//           }
//         });
//         done();
//       });
//   });
});
