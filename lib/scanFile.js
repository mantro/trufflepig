const fs = require('fs');
const os = require('os');
const colors = require('colors/safe');
const readline = require('readline');
const stream = require('stream');

const scanLine = require('./scanLine');

async function scanFile(filename) {

  if (!fs.lstatSync(filename).isFile) {
    throw new Error(`"${filename}" is not a file`);
  }

  return new Promise((resolve, reject) => {

    const instream = fs.createReadStream(filename);
    const outstream = new stream();

    const rl = readline.createInterface(instream, outstream);

    let lineNumber = 0;

    rl.on('line', (line) => {

      lineNumber++;
      const output = scanLine(line);

      if (output.length > 0) {
        console.log();
        console.log(colors.yellow('###> ' + filename + ', line ' + (lineNumber + 1)));
        output.forEach(x => console.log(x));
      }
    });

    rl.on('close', () => {
      resolve();
    })
  });
}

module.exports = scanFile;
