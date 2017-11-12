const path = require('path');

const strings = require('./lib/strings');

const colors = require('colors/safe');

const scanGit = require('./lib/scanGit');
const scanFile = require('./lib/scanFile');
const scanPath = require('./lib/scanPath');

const program = require('commander');

const options = require('./lib/options');

program
  .version('0.0.1')
  .option('-a, --all', 'Show scores word by word')
  .option('-p, --path <path>', 'Add one path to the heystack')
  .option('-g, --git <path>', 'Add one git repository to the haystack')
  .option('-G, --guid', 'Enable GUID detection')
  .option('-f, --file <file>', 'Add one file to the haystack')
  .option('-l, --length <length>', 'Modify minimum word length (default 12)')
  .option('--threshold-full <threshold>', 'set threshold for full charset (default 4.5)')
  .option('--threshold-base64 <threshold>', 'set threshold for base64 charset (default 4.0)')
  .option('--threshold-hex <threshold>', 'set threshold for hex charset (default 3.0)');

program.parse(process.argv);

const stack = [];

async function main() {

  if (program.all) {
    options.showWordByWord = true;
    console.log('showing scores for every word')
  }

  if (program.length) {
    options.wordLength = +program.length;
    console.log('minimum word length set to ' + program.length);
  }

  console.log();

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
  // intentionally left blank
}).catch((err) => {
  console.error(err);
});
