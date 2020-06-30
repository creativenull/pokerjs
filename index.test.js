const Poker = require('./index')

describe('Module Test', () => {
  test('Import the module', () => {
    expect(typeof Poker.RANKING).toBe('object')
  })
})
