const nodegit = require('nodegit');
const path = require('path');
const colors = require('colors/safe');
const minimatch = require('minimatch');

const scanLine = require('./scanLine');
const options = require('./options');
const hashmap = require('./hashMap');

async function getCommits(gitPath) {

  return new Promise(async (resolve, reject) => {

    const repo = await nodegit
      .Repository
      .open(path.resolve(gitPath));

    const masterCommit = await repo.getMasterCommit();

    const history = masterCommit.history(nodegit.Revwalk.SORT.Time);

    const commits = [];

    history.on('commit', function (commit) {

      commits.push(commit);
    });

    history.on('end', () => {
      resolve(commits);
    });

    history.on('error', (err) => {
      reject(err);
    });

    history.start();

  });
}

async function scanGit(gitPath) {

  const commits = await getCommits(gitPath);

  for (const commit of commits) {

    let diffList = await commit.getDiff();

    let summary = {
      commit: commit.sha(),
      author: commit
        .author()
        .name() + ' <' + commit
          .author()
          .email() + '>',
      date: commit.date(),
      message: commit.message(),
      oldFile: '',
      newFile: '',
      hunkHeader: ''
    }

    for (let diff of diffList) {

      const patches = await diff.patches();

      for (let patch of patches) {

        summary.oldFile = patch
          .oldFile()
          .path();
        summary.newFile = patch
          .newFile()
          .path();

        let ignored = options
          .ignoreGlobs
          .find(f => minimatch(summary.newFile, f, options.miniMatchOptions));
        if (ignored) {
          continue;
        }

        const hunks = await patch.hunks();

        for (let hunk of hunks) {

          const lines = await hunk.lines();

          summary.header = hunk
            .header()
            .trim();

          for (let x = 0; x < lines.length; x++) {

            const line = lines[x];
            let result = await scanLine(line.content());

            if (result.length > 0) {

              for (let resultLine of result) {

                if (options.showDuplicates || hashmap.addIfNotExists(resultLine.output)) {

                  console.info(colors.grey('date'), colors.green(summary.date), colors.grey('author'), colors.green(summary.author), colors.grey('sha1'), colors.green(summary.commit));
                  console.info(colors.grey('file'), colors.green(`${summary.newFile}:${x + 1}`), colors.grey('entropy'), colors.green(`${resultLine.entropy} (${resultLine.prefix})`));
                  console.info(resultLine.output);

                  console.log();
                }
              }
            }
          };
        }
      }
    }
  }

}

module.exports = scanGit;
