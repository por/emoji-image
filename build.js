const fs = require('fs');
const emoji = require('emojilib'); // eslint-disable-line import/no-extraneous-dependencies
const fontkit = require('fontkit'); // eslint-disable-line import/no-extraneous-dependencies
const mkdirp = require('mkdirp'); // eslint-disable-line import/no-extraneous-dependencies
const rimraf = require('rimraf'); // eslint-disable-line import/no-extraneous-dependencies

const collectionPath = '/System/Library/Fonts/Apple Color Emoji.ttc'; // >= OS X 10.12
const fontPath = '/System/Library/Fonts/Apple Color Emoji.ttf'; // <= OS X 10.11

let font;

if (fs.existsSync(collectionPath)) {
  [font] = fontkit.openSync(collectionPath).fonts;
} else if (fs.existsSync(fontPath)) {
  font = fontkit.openSync(fontPath);
} else {
  console.log('⚠️ Could not find the emoji font');
  process.exit(1);
}

rimraf.sync(`${__dirname}/images`);
mkdirp.sync(`${__dirname}/images`);

const dictionary = emoji.ordered
  .map(name => ({ name, value: emoji.lib[name].char }))
  .filter(char => char.value)
  .reduce((data, char) => Object.assign({}, data, { [char.value]: char.name }), {});

for (let i = 0; i < font.numGlyphs; i += 1) {
  const glyph = font.getGlyph(i);
  const strings = font.stringsForGlyph(i);
  const image = glyph.getImageForSize(160);

  if (image && strings.length) {
    const char = strings[0];
    const name = dictionary[char];

    fs.writeFileSync(`${__dirname}/images/${name}.png`, image.data);
  }
}
