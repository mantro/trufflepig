const shannon = require('./shannon.js');
const colors = require('colors/safe');
const strings = require('./strings');
const options = require('./options');

function scanLineWithCharset(prefix, line, word, charset, threshold) {

  let found = [];

  let stringSet = strings.stringsOfSet(word, charset, options.minWordLength);

  for (let str of stringSet) {

    let entropy = shannon.shannon(str, charset);
    entropy = Math.round(entropy * 10000) / 10000;

    if ((entropy > threshold) || (options.showWordByWord)) {

      let output = '';

      if (word.length > options.maxWordLength) {

        output = colors.bgRed('(word longer than ' + options.maxWordLength + ' characters ('+ word.length+' characters)');
      }
      else {
        output = line.replace(word, colors.bgYellow.black(word));
      }

      //found.push(colors.red(prefix) + ' ' + output + ' ' + colors.red(entropy));

      const result = {
        prefix,
        output,
        entropy
      }

      found.push(result);
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

    if (options.fullEnabled) {
      found = found.concat(scanLineWithCharset('full', line, word, options.FULL_SET, options.fullThreshold));
    }

    found = found.concat(scanLineWithCharset('hex', line, word, options.HEX_CHARS, options.hexThreshold));
    found = found.concat(scanLineWithCharset('base64', line, word, options.BASE64_CHARS, options.base64Threshold));
  }

  return found;
}

module.exports = scanLine;
