const fs = require('fs');
const os = require('os');
const winston = require('winston');
const colors = require('colors/safe');
const readline = require('readline');
const stream = require('stream');

const hashmap = require('./hashMap');
const fileutils = require('./fileutils');
const scanLine = require('./scanLine');
const options = require('./options');

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
      const result = scanLine(line);

      if (result.length > 0) {
        console.log();

        for (let resultLine of result) {

          if (options.showDuplicates || hashmap.addIfNotExists(resultLine.output)) {

            winston.info(colors.grey('file'), colors.green(`${filename}:${lineNumber+1}`), colors.grey('entropy'), colors.green(`${resultLine.entropy} (${resultLine.prefix})`));
            winston.info(resultLine.output);
            console.log();
          }

        }
      }
    });

    rl.on('close', () => {
      resolve();
    })
  });
}

module.exports = scanFile;
