
function stringsOfSet(word, char_set, threshold = 20) {
  let letters = '';
  let count = 0;
  let strings = [];

  for (let ch of word) {
    if (char_set.indexOf(ch) !== -1) {
      letters += ch;
      count++;
    } else {
      if (count > threshold) {
        strings.push(letters);
      }

      letters = '';
      count = 0;
    }
  }

  if (count > threshold) {
    strings.push(letters);
  }

  return strings;
}

module.exports = {
  stringsOfSet
}
