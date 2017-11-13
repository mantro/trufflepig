const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const HEX_CHARS = '1234567890abcdefABCDEF';
const FULL_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=#!§$%&()[]|{}*-_.:,;\'"?';

let ignoreGlobs = [
  '.gitignore',
  '.git/**',
  'node_modules/**',
  'npm-debug.log',
  '*yarn.lock*',
  '*.json',
  '*.hbs',
  '*.plist',
  '*.pbxproj',
  'AndroidManifest.xml',
  'AppDelegate.m',
  '**/bower_components/**',
  '*.map',
  '**/.idea/**',
  '*.css',
  '*.csv',
  '*.less',
  '*.scss',
  '*.sass'
]

const options = {
  BASE64_CHARS : BASE64_CHARS,
  HEX_CHARS : HEX_CHARS,
  FULL_SET : FULL_SET,
  ignoreGlobs : ignoreGlobs,
  minWordLength : 12,
  maxWordLength: 1000,
  fullEnabled: false,
  base64Threshold: 4.5,
  hexThreshold: 3.5,
  fullThreshold: 4.5,
  showWordByWord: false,
  miniMatchOptions: { nocase: true, dot:true, matchBase: true},
  verbose: false,
  gitEnabled: true,
  showDuplicates: false
};

module.exports = options;
