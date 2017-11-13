const fs = require('fs');
const os = require('os');
const winston = require('winston');
const colors = require('colors/safe');
const readline = require('readline');
const stream = require('stream');
const fileutils = require('./fileutils');

const scanLine = require('./scanLine');

async function scanFile(filename) {

  if (!fs.lstatSync(filename).isFile) {
    throw new Error(`"${filename}" is not a file`);
  }

  if (fileutils.isBinaryFile(filename)) {
    winston.info(colors.gray('Skipping ' + filename + ' (binary)'));
    return;
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
        winston.info();

        winston.info(colors.yellow(`###> ${filename}, line ${lineNumber+1}`));
        output.forEach(x => winston.info(x));
      }
    });

    rl.on('close', () => {
      resolve();
    })
  });
}

module.exports = scanFile;
