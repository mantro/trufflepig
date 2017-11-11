const assert = require('assert');

var stringsOfSet = require('../lib/strings').stringsOfSet;

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const HEX_CHARS = '1234567890abcdefABCDEF';

describe('strings', () => {
  describe('stringsOfSet', () => {
    it('should not return if not enough HEX_CHARS found', () => {
      let strings = stringsOfSet('test', HEX_CHARS);
      assert.equal(strings.length, 0, 'Strings cannot be found if threshold not matched');
    });

    it('should return strings if enough HEX_CHARS found', () => {
      let strings = stringsOfSet('122312231223122312231xx444444443333AAAAAAAAA', HEX_CHARS);
      assert.equal(strings.length, 2, 'All matched strings should be returned');
      assert.equal(strings[0], '122312231223122312231');
      assert.equal(strings[1], '444444443333AAAAAAAAA');
    });

    it('should return strings if enough BASE64_CHARS found', () => {
      let strings = stringsOfSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', BASE64_CHARS);
      assert.equal(strings.length, 1, 'All matched strings should be returned');
      assert.equal(strings[0], 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    });
  });
});
