const shannon = require('./shannon.js');
const colors = require('colors/safe');
const strings = require('./strings');
const options = require('./options');

function scanLineWithCharset(prefix, line, word, charset, threshold) {

  let found = [];

  let stringSet = strings.stringsOfSet(word, charset, options.wordLength);

  for (let str of stringSet) {

    const entropy = shannon.shannon(str, charset);
    if ((entropy > threshold) || (options.showWordByWord)) {
      const output = line.replace(word, colors.green(word));
      found.push(colors.red(prefix) + ' ' + output + ' ' + colors.red(entropy));
    }
  }

  return found;
}

function scanLine(line) {

  line = line.trim();
  let words = line.split(/[ |\t]/);

  if (words == null) {
    return;
  }

  let found = [];

  for (let word of words) {

    found = found.concat(scanLineWithCharset('(full)', line, word, options.FULL_SET, options.fullThreshold));
    found = found.concat(scanLineWithCharset('(hex)', line, word, options.HEX_CHARS, options.hexThreshold));
    found = found.concat(scanLineWithCharset('(base64)', line, word, options.BASE64_CHARS, options.base64Threshold));
  }

  return found;
}

module.exports = scanLine;
