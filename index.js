const path = require('path');
const colors = require('colors/safe');
const program = require('commander');

const fileutils = require('./lib/fileutils');
const strings = require('./lib/strings');
const scanGit = require('./lib/scanGit');
const scanFile = require('./lib/scanFile');
const scanPath = require('./lib/scanPath');
const options = require('./lib/options');

program
  .version('0.0.1')
  .usage('[options] <path ...>')
  .option('-a, --all', 'Show scores word by word')
  .option('-l, --length <length>', 'Modify minimum word length (default 12)')
  .option('-f, --full', 'Enable full charset detection (increases false positives)')
  .option('--threshold-full <threshold>', 'set threshold for full charset (default 4.5)')
  .option('--threshold-base64 <threshold>', 'set threshold for base64 charset (default 4.0)')
  .option('--threshold-hex <threshold>', 'set threshold for hex charset (default 3.0)');

program.parse(process.argv);

const stack = [];

async function main() {

  if (program.all) {
    options.showWordByWord = true;
    console.log(colors.gray('(ENABLED: showing scores for every word)'));
  }

  if (program.full) {
    options.fullEnabled = true;
    console.log(colors.gray('(ENABLED: full character set enabled (will inrease false positives))'));
  }

  if (program.length) {
    options.wordLength = +program.length;
    console.log(colors.gray('(MODIFIED: minimum word length set to ' + program.length + ')'));
  }

  if (program.args.length == 0) {
    program.outputHelp();
    process.exit(1);
  }


  for (var arg of program.args) {

    if (fileutils.hasGitDirectory(arg)) {
      await scanGit(arg);
    }
    else if (fileutils.isDirectory(arg)) {
      await scanPath(arg);
    }
    else if (fileutils.isFile(arg)) {

      await scanFile(arg);
    }
    else {
      throw new Error('Cannot understand: ' + arg);
    }
  }
}

main().then(() => {
  // intentionally left blank
}).catch((err) => {
  console.error(err);
});
