const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const HEX_CHARS = '1234567890abcdefABCDEF';
const FULL_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=#!§$%&()[]|{}*-_.:,;\'"?';

const ignoreGlobs = [
  '.gitignore',
  'node_modules/**',
  'npm-debug.log',
  '*yarn.lock*',
  '*.json',
  '*.hbs',
  'thing/**/*',
  '*.plist',
  '*.pbxproj',
  'AndroidManifest.xml',
  'AppDelegate.m'
]

const options = {
  BASE64_CHARS : BASE64_CHARS,
  HEX_CHARS : HEX_CHARS,
  FULL_SET : FULL_SET,
  ignoreGlobs : ignoreGlobs,
  wordLength : 12,
  fullEnabled: false,
  base64Threshold: 4.2,
  hexThreshold: 3.0,
  fullThreshold: 4.5,
  showWordByWord: false,
  miniMatchOptions: { nocase: true, dot:true, matchBase: true}
};

module.exports = options;
