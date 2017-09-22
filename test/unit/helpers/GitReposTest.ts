/// <reference path="../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { expect } from 'chai';
import { join } from 'path';
import gitRepos from '../../../src/renderer/helpers/GitRepos';

describe('Git Repos test', () => {
  it('should proper search for repos', (done) => {
    let gitDirsWonted = [join(__dirname, '..', '..', '..', '.git')];

    gitRepos.searchRepos(['.'], (dir) => {
      expect(dir).to.be.equal(gitDirsWonted[0]);
    }, (err, dirs) => {
      expect(err).to.be(undefined);
      expect(dirs).to.be.deep.equal(gitDirsWonted);
      done();
    });

  });
});
