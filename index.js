const path = require('path');
const fs = require('fs');
const os = require('os');
const shannon = require('./lib/shannon.js');
const strings = require('./lib/strings');

const colors = require('colors/safe');

const scanGit = require('./lib/git').scanGit;

const program = require('commander');

program
  .version('0.0.1')
  .option('-p, --path <path>', 'Add one path to the heystack')
  .option('-g, --git <path>', 'Add one git repository to the haystack')
  .option('-G, --guid', 'Enable GUID detection')
  .option('-f, --file <file>', 'Add one file to the haystack');

program.parse(process.argv);

const stack = [];

async function scanLineWithCharset(line, word, charset, threshold) {

  let stringSet = strings.stringsOfSet(word, charset, 14);

  for (let str of stringSet) {

    const entropy = shannon.shannon(str, charset);
    if (entropy > threshold) {

      const output = line.replace(word, colors.green(word));
      console.log(output, colors.red(entropy));
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

    if (words == null)
      { continue; }

    for (let word of words) {

      await scanLineWithCharset(line, word, shannon.FULL_SET, 4.5);
      await scanLineWithCharset(line, word, shannon.HEX_CHARS, 3);
      await scanLineWithCharset(line, word, shannon.BASE64_CHARS, 4);
    }
  }
}

async function scanPath(pathname) {}

async function main() {

  if (program.file) {
    await scanFile(program.file);
  }

  if (program.path) {
    await scanPath(program.path);
  }

  if (program.git) {
    await scanGit(program.git);
  }
}

main().then(() => {
  console.log('Finished');
}).catch((err) => {
  console.log(err);
});
