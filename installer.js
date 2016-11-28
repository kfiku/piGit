var installer = require('electron-installer-debian');

var options = {
  name: 'pi-git',
  productName: 'piGit',
  genericName: 'Git Utility',
  src: 'release/piGit-linux-x64/',
  dest: 'release/installers/',
  icon: 'logo/piGit.png',
  arch: 'amd64',
  maintainer: 'Grzegorz Klimek <kfiku.com@gmail.com>',
  homepage: 'https://github.com/kfiku',
  version: '0.0.1',
  categories: [
    "Utility"
  ],
  // lintianOverrides: [
  //   "changelog-file-missing-in-native-package"
  // ],
  bin: 'piGit'
}

console.log('Creating package (this may take a while)')

installer(options, function (err) {
  if (err) {
    console.error(err, err.stack)
    process.exit(1)
  }

  console.log('Successfully created package at ' + options.dest)
})
