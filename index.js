const path = require('path');
const fs = require('fs');
const os = require('os');
const shannon = require('./lib/shannon.js');


const program = require('commander');

program
  .version('0.0.1')
  .option('-p, --path <path>', 'Add one path to the heystack')
  .option('-g, --git', 'Add one git repository to the haystack')
  .option('-G, --guid', 'Enable GUID detection')
  .option('-f, --file <file>', 'Add one file to the haystack');

program.parse(process.argv);

const stack = [];


async function scanFile(filename) {

  if (!fs.lstatSync(filename).isFile) {
    throw new Error(`"${filename}" is not a file`);
  }

  const lines = fs.readFileSync(filename, 'UTF8').split(os.EOL);
  for(let line of lines) {
    console.log(line, shannon.shannon(line));
  }
}

async function scanPath(pathname) {

}

async function main() {

  if (program.file) {
    await scanFile(program.file);
  }

  if (program.path) {
    await scanPath(program.path);
  }
}



main().then(() => {
  console.log('Finished');
}).catch((err) => {
  console.log(err);
});
