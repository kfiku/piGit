var pkg = require('./package.json');
var installer = require('electron-installer-debian');
// var createDMG = require('electron-installer-dmg')

var options = {
  name: pkg.name.toLowerCase(),
  productName: pkg.name,
  genericName: 'Git Utility',
  src: 'release/PiGit-linux-x64/',
  dest: 'release/installers/',
  icon: 'logo/piGit.png',
  arch: 'amd64',
  maintainer: `${pkg.author.name} <${pkg.author.email}>`,
  homepage: pkg.homepage,
  version: pkg.version,
  categories: [
    "Utility"
  ],
  // lintianOverrides: [
  //   "changelog-file-missing-in-native-package"
  // ],
  bin: 'PiGit'
}

console.log('Creating package (this may take a while)')

installer(options, function (err) {
  if (err) {
    console.error(err, err.stack)
    process.exit(1)
  }

  console.log('Successfully created package at ' + options.dest)
})


// options.src = 'release/PiGit-darwin-x64/';

// createDMG(options, function done (err) {
//   console.log(err, 'done');
// })
