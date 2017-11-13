const crypto = require('crypto');

class HashMap {

  constructor() {

    this.hashes = [];
  }

  clear() {

    this.hashes = [];
  }

  addIfNotExists(str) {

    const md5 = crypto.createHash('md5');
    const hash = md5.update(str).digest('hex');

    if (this.hashes.indexOf(hash) === -1) {

      this.hashes.push(hash);
      return true;
    }

    return false;
  }
}


module.exports = new HashMap();
