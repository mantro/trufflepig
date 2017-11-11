var nodegit = require("nodegit");
var path = require("path");
const colors = require('colors/safe');

var shannonBase64 = require('./shannon').shannonBase64;
var shannonHex = require('./shannon').shannonHex;
var stringsOfSet = require('./strings').stringsOfSet;

const BASE64_CHARS = require('./consts').BASE64_CHARS;
const HEX_CHARS = require('./consts').HEX_CHARS;

// todo: read this from command line and fallback to defaults
const ignoredFiles = ['yarn.lock', '-test.js', 'package.json'];

const b64EntropyThreshold = 3.6;
const hexEntropyThreshold = 3;

async function scanGit(gitPath) {

  let repo = await nodegit.Repository.open(path.resolve(gitPath));

  let masterCommit = await repo.getMasterCommit();

  var history = await masterCommit.history(nodegit.Revwalk.SORT.Time);
  let processed = {};

  history.on("commit", async function (commit) {

    let diffList = await commit.getDiff();

    let summary = {
      commit: commit.sha(),
      author: commit.author().name() + " <" + commit.author().email() + ">",
      date: commit.date(),
      message: commit.message(),
      oldFile: '',
      newFile: '',
      hunkHeader: ''
    }

    for (let diff of diffList) {

      const patches = await diff.patches();

      for (let patch of patches) {

        let ignored = ignoredFiles.find(f => patch.newFile().path().endsWith(f));
        if (ignored) {
          return;
        }

        const hunks = await patch.hunks();

        for (let hunk of hunks) {

          const lines = await hunk.lines();
          summary.oldFile = patch.oldFile().path();
          summary.newFile = patch.newFile().path();
          summary.header = hunk.header().trim();

          lines.forEach((line) => {
            for (let str of stringsOfSet(line.content().trim(), BASE64_CHARS, 12)) {
              let b64Entropy = shannonBase64(str);

              if (b64Entropy > b64EntropyThreshold) {
                summary.line = line.content().trim();
                summary.match = str;
                summary.entropy = b64Entropy;
                // console.log(summary, summary.newFile, summary.match, b64Entropy);
                console.log('file:', summary.newFile);
                console.log('method:', 'base64');
                console.log('entropy:', b64Entropy);
                console.log(summary.line.replace(summary.match, colors.red(summary.match)));
                console.log('\n');
              }
            }

            for (let str of stringsOfSet(line.content().trim(), HEX_CHARS, 12)) {
              let hexEntropy = shannonHex(str);
              if (hexEntropy > hexEntropyThreshold) {
                summary.line = line.content().trim();
                summary.match = str;
                summary.entropy = hexEntropy;
                // console.log(summary, summary.newFile, summary.match, hexEntropy);
                console.log('file:', summary.newFile);
                console.log('method:', 'hex');
                console.log('entropy:', hexEntropy);
                console.log(summary.line.replace(summary.match, colors.red(summary.match)));
                console.log('\n');
              }
            }
          });
        }
      }
    }
  });

  history.start();
}

module.exports = {
  scanGit
}
