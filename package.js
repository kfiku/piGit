var pkg = require('./package.json');
var packager = require('electron-packager');

packager({
    dir: './',
    name: pkg.name,
    appVersion: pkg.version,
    // all: true,
    platform: 'linux',
    arch: 'x64',

    icon: 'logo/piGit.png',

    out: 'release',
    // asar: true,
    overwrite: true,
    ignore: [
      'coverage$',
      'test$',
      'release$',
      '.travis.yml$',
      '.gitignore$',
      '.editorconfig$',
      'installer.js$',
      'package.js$',
      'tsconfig.json',
      'tslint.json',
      '.*\.sublime-.*',
      'src/.*/.*\.js\.map',
      // 'src/.*/.*\.ts',
      'src/.*/.*\.tsx',
      'scss$',

    ]
  },
  function done_callback (err, appPaths) {
    console.log('package done ', appPaths);
  }
);
