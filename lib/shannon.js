// followed http://blog.dkbza.org/2007/05/scanning-data-for-entropy-anomalies.html

const BASE64_CHARS = require('./consts').BASE64_CHARS;
const HEX_CHARS = require('./consts').HEX_CHARS;

function unique(str) {

    const unique = str
        .split('')
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .join('');

    return unique;
}

function count(str, char) {

    const reserved = '^?$[]|{}()/-+*.';

    char = reserved.split('').reduce((prev, cur) => {
        return prev.replace(cur, "\\" + cur);
    }, char);

    const result = (str.match(new RegExp(char, "g")) || []).length;

    return result == result ? result : 0;
}

function shannon(str, chars) {

    if (chars == null) {
        chars = unique(str);
    }

    let strCount = str.length;
    let charCount = chars.length;

    let sum = 0;

    for (let x = 0; x < charCount; x++) {

        let cnt = count(str, chars[x]);

        let temp = cnt / strCount;

        if (temp > 0) {
            sum += -temp * Math.log2(temp);
        }

    }

    return sum;
}

const shannonBase64 = (str) => {
    return shannon(str, BASE64_CHARS.split(''));
}

const shannonHex = (str) => {
    return shannon(str, HEX_CHARS.split(''));
}


module.exports = { shannon, shannonBase64, shannonHex, BASE64_CHARS, HEX_CHARS};
