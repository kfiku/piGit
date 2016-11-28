var packager = require('electron-packager');

packager({
    dir: './',
    name: 'piGit',
    'app-version': '0.0.1',
    // all: true,
    platform: 'linux',
    arch: 'x64',

    icon: 'logo/piGit.png',

    out: 'release',
    overwrite: true
  },
  function done_callback (err, appPaths) {

  }
);
