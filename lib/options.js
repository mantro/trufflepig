const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const HEX_CHARS = '1234567890abcdefABCDEF';
const FULL_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=#!§$%&()[]|{}*-_.:,;\'"?';

const ignoreGlobs = [
  '.gitignore',
  'node_modules/**',
  'npm-debug.log',
  '*yarn.lock*'
]

const options = {
  BASE64_CHARS : BASE64_CHARS,
  HEX_CHARS : HEX_CHARS,
  FULL_SET : FULL_SET,
  ignoreGlobs : ignoreGlobs,
  wordLength : 12,
  base64Threshold: 4.0,
  hexThreshold: 3.0,
  fullThreshold: 4.5,
  showWordByWord: false
};

module.exports = options;
