const path = require('path');
const colors = require('colors/safe');
const program = require('commander');
const winston = require('winston');

const fileutils = require('./lib/fileutils');
const strings = require('./lib/strings');
const scanGit = require('./lib/scanGit');
const scanFile = require('./lib/scanFile');
const scanPath = require('./lib/scanPath');
const options = require('./lib/options');
const hashmap = require('./lib/hashMap');

winston.level = 'info';

program
  .version('0.0.1')
  .usage('[options] <path ...>')
  .option('-a, --all', 'Show scores word by word')
  .option('-f, --full', 'Enable full charset detection (increases false positives)')
  .option('-i, --ignore <glob>', 'Ignore the specified pattern. Specify multiple patterns seperated by comma.')
  .option('--min-word-length <length>', 'Modify minimum word length (default 12)')
  .option('--max-word-length <length>', 'Modify maximum word length (default 1000)')
  .option('--no-git', 'Disable git processing')
  .option('-d, --duplicates', 'Show exact line duplicates')
  .option('-v, --verbose', 'Output verbose message')
  .option('--threshold-full <threshold>', 'set threshold for full charset (default 4.5)')
  .option('--threshold-base64 <threshold>', 'set threshold for base64 charset (default 4.0)')
  .option('--threshold-hex <threshold>', 'set threshold for hex charset (default 3.0)');

program.parse(process.argv);

const stack = [];

async function main() {

  if (program.verbose) {
    winston.level = 'debug';
    winston.debug(colors.gray('(enabled verbose output)'));
  }

  if (program.ignore) {

    const arr = program.ignore.split(',');
    options.ignoreGlobs = options.ignoreGlobs.concat(arr);

    winston.debug(colors.gray('(ignore patterns:)'));
    options.ignoreGlobs.forEach(x => winston.debug(colors.gray(x)));
  }

  if (program.git === false) {
    options.gitEnabled = false;
    winston.debug(colors.gray('(disabled git processing)'));
  }

  if (program.duplicates === true) {
    options.showDuplicates = true;
    winston.debug(colors.gray('(duplicates will be shown)'));
  }

  if (program.all) {
    options.showWordByWord = true;
    winston.debug(colors.gray('(showing scores for every word)'));
  }

  if (program.full) {
    options.fullEnabled = true;
    winston.debug(colors.gray('(full character set enabled (will inrease false positives))'));
  }

  if (program.minWordLength) {
    options.minWordLength = +program.minWordLength;
    winston.debug(colors.gray('(minimum word length set to ' + program.length + ')'));
  }

  if (program.maxWordLength) {
    options.maxWordLength = +program.maxWordLength;
    winston.debug(colors.gray('(maximum word length set to ' + program.length + ')'));
  }

  if (program.args.length == 0) {
    program.outputHelp();
    process.exit(1);
  }


  for (var arg of program.args) {

    hashmap.clear();

    if (fileutils.hasGitDirectory(arg) && options.gitEnabled  ) {
      await scanGit(arg);
    }
    else if (fileutils.isDirectory(arg)) {
      await scanPath(arg);
    }
    else if (fileutils.isFile(arg)) {

      await scanFile(arg);
    }
    else {
      winston.error(colors.gray('No such file or directory: ') + colors.red(arg));
      process.exit(1);
    }
  }
}

main().then(() => {
  // intentionally left blank
}).catch((err) => {
  console.error(err);
});
