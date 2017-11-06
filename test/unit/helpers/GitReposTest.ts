import { expect } from 'chai';
import { join } from 'path';
import gitRepos from '../../../src/renderer/helpers/GitRepos';

it('should proper search for repos', (done) => {
  let gitDirsWonted = [join(__dirname, '..', '..', '..')];

  gitRepos.searchRepos(['.'], (dir) => {
    expect(dir).to.be.equal(gitDirsWonted[0]);
  }, (err, dirs) => {
    expect(err).to.equal(null);
    expect(dirs).to.be.deep.equal(gitDirsWonted);
    done();
  });
});
