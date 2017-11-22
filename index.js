const charToCode = char =>
  char.split('').map(c => ('0000' + c.charCodeAt(0).toString(16)).slice(-4)).join('-');

module.exports = (emoji) => require('./assets/' + charToCode(emoji));
