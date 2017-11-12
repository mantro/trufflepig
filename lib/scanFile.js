const fs = require('fs');
const os = require('os');

const scanLine = require('./scanLine');

async function scanFile(filename) {

  if (!fs.lstatSync(filename).isFile) {
    throw new Error(`"${filename}" is not a file`);
  }

  const lines = fs
    .readFileSync(filename, 'UTF8')
    .split(os.EOL);

  for (let line of lines) {

    scanLine(line);
  }
}

module.exports = scanFile;
