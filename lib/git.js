var nodegit = require("nodegit");
var path = require("path");
var shannon = require('./shannon');

const ignoredFiles = ['package-lock.json'];

async function main() {

  let repo = await nodegit.Repository.open(path.resolve(__dirname, "../.git"));

  let masterCommit = await repo.getMasterCommit();

  var history = await masterCommit.history(nodegit.Revwalk.SORT.Time);

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

        let ignored = ignoredFiles.find(f => patch.oldFile().path().endsWith(f));
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

              // IMPLEMENT PAYLOAD
            });
          }
        }
      }
    }
  });

  history.start();
}

main();
