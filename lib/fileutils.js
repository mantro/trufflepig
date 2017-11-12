const fs = require('fs');
const path = require('path');
const is_binary_file = require('isbinaryfile');

function isFile(dir) {

  try {
    return fs
      .lstatSync(dir)
      .isFile();

  } catch (err) {
    // intentionally left blank
  }

  return false;

}

function isDirectory(dir) {

  try {
    return fs
      .lstatSync(dir)
      .isDirectory();

  } catch (err) {
    // intentionally left blank
  }

  return false;

}

function hasGitDirectory(dir) {

  return isDirectory(dir) && isDirectory(path.join(dir, '.git'));
}

function isBinaryFile(file) {

  return is_binary_file.sync(file);
}

module.exports = {
  isFile,
  isDirectory,
  hasGitDirectory,
  isBinaryFile
};
