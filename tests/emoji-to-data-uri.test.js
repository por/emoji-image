const emojiToDataURI = require('../');

const poopEmoji = require('./fixtures/poop-emoji');
const happySweatEmoji = require('./fixtures/happy-sweat-emoji');

describe('emojiToDataURI', () => {
  it('converts 💩 to data uri', () => {
    expect(emojiToDataURI('💩')).toBe(poopEmoji);
  });

  it('converts 😅 to data uri', () => {
    expect(emojiToDataURI('😅')).toBe(happySweatEmoji);
  });
});
