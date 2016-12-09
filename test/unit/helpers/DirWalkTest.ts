/// <reference path="../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { expect } from 'chai';
import { join } from 'path';
import dirWalk from '../../../src/helpers/DirWalk';

describe('DirWalk test', () => {
  it('should proper search for dirs', (done) => {
    let dirsWonted = [join(__dirname, '..', '..', '..', '.git')];

    dirWalk('./', (dir) => {
      expect(dir).to.be.equal(dirsWonted[0]);
    }, (err, dirs) => {
      expect(dirs).to.be.deep.equal(dirsWonted);
      done();
    }, '.git', 6);
  });
});
