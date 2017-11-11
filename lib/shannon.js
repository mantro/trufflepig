// followed http://blog.dkbza.org/2007/05/scanning-data-for-entropy-anomalies.html

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const HEX_CHARS = '1234567890abcdefABCDEF';

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

        sum += -temp * Math.log2(temp);
    }

    return sum;
}

const shannonBase64 = (str) => {
    return shannon(str, BASE64_CHARS);
}

const shannonHex = (str) => {
    return shannon(str, HEX_CHARS);
}


module.exports = { shannon, shannonBase64, shannonHex};
