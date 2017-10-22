import { expect } from 'chai';
import { join } from 'path';
import dirWalk from '../../../src/renderer/helpers/DirWalk';

it('should proper search for dirs', (done) => {
  let dirsWonted = [join(__dirname, '..', '..', '..', '.git')];

  dirWalk('./', (dir) => {
    expect(dir).to.be.equal(dirsWonted[0]);
  }, (err, dirs) => {
    expect(err).to.equal(null);
    expect(dirs).to.be.deep.equal(dirsWonted);
    done();
  }, '.git', 6);
});
