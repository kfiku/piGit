import stashList from '../stash';

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
