import { stashList, status } from '../git';

describe('stashList', () => {
  it('should work fine with empty stash', (done) => {
    stashList('dir', () => Promise.resolve(`
    `))
    .then(stashes => {
      expect(stashes).toEqual([]);
      done();
    });
  });

  it('should work fine with proper, multiple data', (done) => {
    stashList('dir', () => Promise.resolve(`
      stash@{0}__2017.12.18 21:39__testing this shit
      stash@{1}__2017.12.18 21:40__testing this shit again
      stash@{2}__2017.12.18 21:41__testing this shit one more
    `))
      .then(stashes => {
        expect(stashes).toEqual([
          {
            id: 'stash@{0}',
            date: '2017.12.18 21:39',
            message: 'testing this shit'
          },
          {
            id: 'stash@{1}',
            date: '2017.12.18 21:40',
            message: 'testing this shit again'
          },
          {
            id: 'stash@{2}',
            date: '2017.12.18 21:41',
            message: 'testing this shit one more'
          }
        ]);
        done();
      });
  });

  it('should work fine with proper, multiple data + wrong', (done) => {
    stashList('dir', () => Promise.resolve(`
      stash@{0}__2017.12.18 21:39__testing this shit
      stash@{1}__2017.12.18 21:40_testing this shit again
      stash@{2}__2017.12.18 21:41__testing this shit one more
    `))
      .then(stashes => {
        expect(stashes).toEqual([
          {
            id: 'stash@{0}',
            date: '2017.12.18 21:39',
            message: 'testing this shit'
          },
          {
            id: 'stash@{2}',
            date: '2017.12.18 21:41',
            message: 'testing this shit one more'
          }
        ]);
        done();
      });
  });
});

describe('status', () => {
  it('should work fine with empty status', (done) => {
    status('dir', () => Promise.resolve(''))
      .catch(e => {
        expect(e).toBeDefined();
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
