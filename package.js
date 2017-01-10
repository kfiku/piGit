var pkg = require('./package.json');
var packager = require('electron-packager');

packager({
    dir: './',
    name: pkg.name,
    'app-version': pkg.version,
    // all: true,
    platform: 'linux',
    arch: 'x64',

    icon: 'logo/piGit.png',

    out: 'release',
    asar: true,
    overwrite: true
  },
  function done_callback (err, appPaths) {
    console.log('package done ', appPaths);
  }
);
