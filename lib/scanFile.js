const shannon = require('./shannon.js');
const fs = require('fs');
const colors = require('colors/safe');
const strings = require('./strings');
const options = require('./options');
const os = require('os');

async function scanLineWithCharset(prefix, line, word, charset, threshold) {

  let stringSet = strings.stringsOfSet(word, charset, options.wordLength);

  for (let str of stringSet) {

    const entropy = shannon.shannon(str, charset);
    if (entropy > threshold) {

      const output = line.replace(word, colors.green(word));
      console.log(colors.red(prefix), output, colors.red(entropy));
    } else if (options.showWordByWord) {
      const output = line.replace(word, colors.green(word));
      console.log(colors.red(prefix), output, colors.red(entropy));
    }

  }
}

async function scanFile(filename) {

  if (!fs.lstatSync(filename).isFile) {
    throw new Error(`"${filename}" is not a file`);
  }

  const lines = fs
    .readFileSync(filename, 'UTF8')
    .split(os.EOL);

  for (let line of lines) {

    line = line.trim();
    let words = line.split(/[ |\t]/);

    if (words == null) {
      continue;
    }

    for (let word of words) {

      await scanLineWithCharset('(full)', line, word, options.FULL_SET, options.fullThreshold);
      await scanLineWithCharset('(hex)', line, word, options.HEX_CHARS, options.hexThreshold);
      await scanLineWithCharset('(base64)', line, word, options.BASE64_CHARS, options.base64Threshold);
    }
  }
}

module.exports = scanFile;
