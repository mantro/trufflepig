var nodegit = require("nodegit");
var path = require("path");

var shannonBase64 = require('./shannon').shannonBase64;
var shannonHex = require('./shannon').shannonHex;
var stringsOfSet = require('./strings').stringsOfSet;

const BASE64_CHARS = require('./consts').BASE64_CHARS;
const HEX_CHARS = require('./consts').HEX_CHARS;

// todo: read this from command line and fallback to defaults
const ignoredFiles = ['package-lock.json', 'yarn.lock'];
const ignoredPaths = ['test/', 'lib/'];

const b64EntropyThreshold = 4.5;
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

        let ignored = ignoredFiles.find(f => patch.oldFile().path().endsWith(f)) || ignoredPaths.find(g => patch.oldFile().path().indexOf(g) !== -1);
        if (ignored) {
          console.log('ignoring', ignored);
          return;
        }

        const hunks = await patch.hunks();

        for (let hunk of hunks) {

          const lines = await hunk.lines();
          for (let line of lines) {

            summary.oldFile = patch.oldFile().path();
            summary.newFile = patch.newFile().path();
            summary.header = hunk.header().trim();

            lines.forEach((line) => {

              // console.log(String.fromCharCode(line.origin()) + line.content().trim());

              for (let str of stringsOfSet(line.content().trim(), BASE64_CHARS)) {
                let b64Entropy = shannonBase64(str);
                if (b64Entropy > b64EntropyThreshold) {
                  summary.line = line.content().trim();
                  summary.match = str;
                  summary.entropy = b64Entropy;
                  console.log(summary);
                }
              }

              for (let str of stringsOfSet(line.content().trim(), HEX_CHARS)) {
                let hexEntropy = shannonHex(str);
                if (hexEntropy > hexEntropyThreshold) {
                  summary.line = line.content().trim();
                  summary.match = str;
                  summary.entropy = hexEntropy;
                  console.log(summary);
                }
              }
            });
          }
        }
      }
    }
  });

  history.start();
}

module.exports = {
  scanGit
}
