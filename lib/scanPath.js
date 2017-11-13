const readdir = require('recursive-readdir');
const scanFile = require('./scanFile');
const options = require('./options');
const minimatch = require('minimatch');

async function scanPath(pathName) {

  const items = await readdir(pathName);

  for(let item of items) {

    let ignored = options.ignoreGlobs.find(f => minimatch(item, f, options.miniMatchOptions));
    if (ignored) {
      continue;
    }

    await scanFile(item);
  }
}

module.exports = scanPath;
