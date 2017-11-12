const readdir = require('recursive-readdir');
const scanFile = require('./scanFile');

async function scanPath(pathName) {

  const items = await readdir(pathName);

  for(let item of items) {

    await scanFile(item);
  }
}

module.exports = scanPath;
