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

//   it('should work fine with some status', (done) => {
//     status('dir', () => `
// ## master...origin/master [ahead 2]
// MM GitRepos.ts
// AM git.ts
// D  icon.ts
// R  isAppFocused.ts -> isAppFocuseds.ts
//  M transducers.ts
// ?? icons.ts
// ?? test/git.test.ts
//     `)
//       .then(st => {
//         expect(st).toEqual({
//           branch: 'master',
//           stats: {
//             ahead: 2,
//             behind: 0,
//             modified: 3,
//             deleted: 1,
//             renamed: 1,
//             untracked: 2,
//             conflicted: 0
//           },
//           lists: {
//             staged: [
//               { path: 'GitRepos.ts', type: 'M', staged: true, conflicted: false },
//               { path: 'git.ts', type: 'A', staged: true, conflicted: false },
//               { path: 'icon.ts', type: 'D', staged: true, conflicted: false },
//               { path: 'isAppFocuseds.ts', type: 'R', staged: true, conflicted: false }
//             ],
//             unstaged: [
//               { path: 'icons.ts', type: '?', staged: false, conflicted: false },
//               { path: 'git.ts', type: 'M', staged: false, conflicted: false },
//               { path: 'test/git.test.ts', type: '?', staged: false, conflicted: false },
//             ],
//             conflicted: []
//           }
//         });
//         done();
//       });
//   });
});
