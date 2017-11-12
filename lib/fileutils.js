const fs = require('fs');
const path = require('path');

function isFile(dir) {

  return fs
    .lstatSync(dir)
    .isFile();
}

function isDirectory(dir) {

  return fs
    .lstatSync(dir)
    .isDirectory();
}

function hasGitDirectory(dir) {

  return isDirectory(dir) && isDirectory(path.join(dir, '.git'));
}

module.exports = {
  isFile,
  isDirectory,
  hasGitDirectory
};
