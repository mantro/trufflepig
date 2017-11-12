const fs = require('fs');
const os = require('os');
const colors = require('colors/safe');

const scanLine = require('./scanLine');

async function scanFile(filename) {

  if (!fs.lstatSync(filename).isFile) {
    throw new Error(`"${filename}" is not a file`);
  }

  const lines = fs
    .readFileSync(filename, 'UTF8')
    .split(os.EOL);

  for(let x = 0; x<lines.length; x++) {
    const line = lines[x];
    const output = await scanLine(line);

    if (output.length > 0) {
      console.log();
      console.log(colors.yellow('###> ' + filename + ', line ' + (x+1)));
      output.forEach(x => console.log(x));
    }
  }
}

module.exports = scanFile;
