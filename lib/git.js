var nodegit = require("nodegit");
var path = require("path");
var shannon = require('./shannon');

const ignoredFiles = [
  'package-lock.json'
];

async function main() {
  let repo = await nodegit.Repository.open(path.resolve(__dirname, "../.git"));
  let masterCommit = await repo.getMasterCommit();
  var history = await masterCommit.history(nodegit.Revwalk.SORT.Time);

  history.on("commit", async function (commit) {
    console.log('comm', commit);
    console.log("commit " + commit.sha());
    console.log("Author:", commit.author().name() +
      " <" + commit.author().email() + ">");
    console.log("Date:", commit.date());
    console.log("\n    " + commit.message());

    let diffList = await commit.getDiff();

    diffList.forEach(function (diff) {
      diff.patches().then(function (patches) {
        patches.forEach(function (patch) {
          let ignored = ignoredFiles.find(f => patch.oldFile().path().endsWith(f));
          if (ignored) {
            console.log('ignoring', ignored);
            return;
          }

          patch.hunks().then(function (hunks) {
            hunks.forEach(function (hunk) {
              hunk.lines().then(function (lines) {
                console.log('------------------------');

                console.log("diff", patch.oldFile().path(),
                  patch.newFile().path());
                console.log(hunk.header().trim());
                lines.forEach(function (line) {

                  console.log(String.fromCharCode(line.origin()) + line.content().trim());
                  //console.log(String.fromCharCode(line.origin()) +
                    //line.content().trim());
                });
              });
            });
          });
        });
      });
    });
  });

  history.start();
}

main();
