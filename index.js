const colors = require('colors/safe');
const program = require('commander');

const fileutils = require('./lib/fileutils');
const scanGit = require('./lib/scanGit');
const scanFile = require('./lib/scanFile');
const scanPath = require('./lib/scanPath');
const options = require('./lib/options');
const hashmap = require('./lib/hashMap');

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
  .option('--threshold-full <threshold>', 'set threshold for full charset (default 4.5)')
  .option('--threshold-base64 <threshold>', 'set threshold for base64 charset (default 4.0)')
  .option('--threshold-hex <threshold>', 'set threshold for hex charset (default 3.0)');

program.parse(process.argv);

async function main() {

  if (program.ignore) {

    const arr = program.ignore.split(',');
    options.ignoreGlobs = options.ignoreGlobs.concat(arr);

    console.debug(colors.gray('(ignore patterns:)'));
    options.ignoreGlobs.forEach(x => console.debug(colors.gray(x)));
  }

  if (program.thresholdFull) {
    options.fullThreshold = +program.thresholdFull;
    console.debug(colors.gray('(set full threshold to: ' + options.fullThreshold + ')'));
  }

  if (program.thresholdBase64) {
    options.base64Threshold = +program.thresholdBase64;
    console.debug(colors.gray('(set base64 threshold to: ' + options.base64Threshold + ')'));
  }

  if (program.thresholdHex) {
    options.hexThreshold = +program.thresholdHex;
    console.debug(colors.gray('(set hex threshold to: ' + options.hexThreshold + ')'));
  }

  if (program.git === false) {
    options.gitEnabled = false;
    console.debug(colors.gray('(disabled git processing)'));
  }

  if (program.duplicates === true) {
    options.showDuplicates = true;
    console.debug(colors.gray('(duplicates will be shown)'));
  }

  if (program.all) {
    options.showWordByWord = true;
    console.debug(colors.gray('(showing scores for every word)'));
  }

  if (program.full) {
    options.fullEnabled = true;
    console.debug(colors.gray('(full character set enabled (will inrease false positives))'));
  }

  if (program.minWordLength) {
    options.minWordLength = +program.minWordLength;
    console.debug(colors.gray('(minimum word length set to ' + program.length + ')'));
  }

  if (program.maxWordLength) {
    options.maxWordLength = +program.maxWordLength;
    console.debug(colors.gray('(maximum word length set to ' + program.length + ')'));
  }

  if (program.args.length == 0) {
    program.outputHelp();
    process.exit(1);
  }


  for (var arg of program.args) {

    hashmap.clear();

    if (fileutils.hasGitDirectory(arg) && options.gitEnabled) {
      await scanGit(arg);
    }
    else if (fileutils.isDirectory(arg)) {
      await scanPath(arg);
    }
    else if (fileutils.isFile(arg)) {

      await scanFile(arg);
    }
    else {
      console.error(colors.gray('No such file or directory: ') + colors.red(arg));
      process.exit(1);
    }
  }
}

main().then(() => {
  // intentionally left blank
}).catch((err) => {
  console.error(err);
});
