const nodegit = require("nodegit");
const path = require("path");
const colors = require('colors/safe');
const winston = require('winston');

const shannonBase64 = require('./shannon').shannonBase64;
const shannonHex = require('./shannon').shannonHex;
const stringsOfSet = require('./strings').stringsOfSet;

const minimatch = require('minimatch');

const scanLine = require('./scanLine');

const options = require('./options');

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

        summary.oldFile = patch.oldFile().path();
        summary.newFile = patch.newFile().path();

        let ignored = options.ignoreGlobs.find(f => minimatch(summary.newFile, f, options.miniMatchOptions));
        if (ignored) {
          return;
        }

        const hunks = await patch.hunks();

        for (let hunk of hunks) {

          const lines = await hunk.lines();
          summary.header = hunk.header().trim();

          for(let x = 0; x < lines.length; x++) {

            const line = lines[x];
            let output = await scanLine(line.content());

            if (output.length > 0) {
              winston.info();
              winston.info(colors.yellow('###> ' + summary.date + ' ' + summary.author + ' ' + summary.commit));
              winston.info(colors.yellow('###> ' + summary.newFile + ', Line ' + (x+1)));
              output.forEach(x => winston.info(x));
            }
          };
        }
      }
    }
  });

  history.start();
}

module.exports = scanGit;
