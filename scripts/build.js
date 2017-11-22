var fontkit = require('fontkit');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var imageDataURI = require('image-data-uri');

// delete the images directory and re-create it
rimraf.sync(__dirname + '/../assets');
mkdirp.sync(__dirname + '/../assets');

var collectionPath = '/System/Library/Fonts/Apple Color Emoji.ttc'; // >= OS X 10.12
var fontPath = '/System/Library/Fonts/Apple Color Emoji.ttf'; // <= OS X 10.11

function getFont() {
  if (fs.existsSync(collectionPath)) return fontkit.openSync(collectionPath).fonts[0]; // both fonts in the collection seem to be identical
  if (fs.existsSync(fontPath)) return fontkit.openSync(fontPath);
  console.log('Could not find the emoji font');
  return null;
}

var font = getFont();
if (font) {
  for (let i = 0; i < font.numGlyphs; i++) {
    let glyph = font.getGlyph(i);
    let strings = font.stringsForGlyph(i);
    let image = glyph.getImageForSize(160);
    if (image && strings.length > 0) {
      // Remove variation selectors from image file names. Reduces duplicates tremendously.
      let strs = new Set(strings.map(s => s.replace(/[\ufe00-\ufe0f\u200d]/g, '')));
      for (let s of strs) {
        let name = s.split('').map(c => ('0000' + c.charCodeAt(0).toString(16)).slice(-4)).join('-');
        let dataBuffer = new Buffer(image.data);
        let mediaType = 'PNG';

        fs.writeFileSync(__dirname + '/../assets/' + name + '.js', `module.exports = '${imageDataURI.encode(dataBuffer, mediaType)}';`);
      }
    }
  }
}
