const Deck = require('deckjs')
const Poker = require('./Poker')

/* Mock poker data */
const poker = new Poker()

const royalFlushPlayer = {
  id: 'player1',
  hand: Deck.parse(['c_87#AS', 'c_12#KS', 'c_33#QS', 'c_88#JS', 'c_90#10S'])
}

const straightFlushPlayer = {
  id: 'player2',
  hand: Deck.parse(['c_87#KD', 'c_12#QD', 'c_33#JD', 'c_88#10D', 'c_90#9D'])
}

const fourKindPlayer = {
  id: 'player3',
  hand: Deck.parse(['c_87#10H', 'c_12#7D', 'c_33#10D', 'c_88#10S', 'c_90#10C'])
}

const fullHousePlayer = {
  id: 'player4',
  hand: Deck.parse(['c_87#7D', 'c_12#7S', 'c_33#9C', 'c_88#9S', 'c_90#9H'])
}

const flushPlayer = {
  id: 'player5',
  hand: Deck.parse(['c_87#AH', 'c_12#JH', 'c_33#9H', 'c_88#6H', 'c_90#5H'])
}

const straightPlayer = {
  id: 'player6',
  hand: Deck.parse(['c_87#4H', 'c_12#5D', 'c_33#6H', 'c_88#7C', 'c_90#8H'])
}

const threeKindPlayer = {
  id: 'player7',
  hand: Deck.parse(['c_87#KH', 'c_12#10S', 'c_33#KS', 'c_88#KD', 'c_90#5C'])
}

const twoPlayer = {
  id: 'player8',
  hand: Deck.parse(['c_87#KH', 'c_12#AS', 'c_33#AD', 'c_88#8H', 'c_90#8C'])
}

const onePlayer = {
  id: 'player9',
  hand: Deck.parse(['c_87#8H', 'c_12#8H', 'c_33#2S', 'c_88#3H', 'c_90#9C'])
}

const highPlayer = {
  id: 'player10',
  hand: Deck.parse(['c_87#AS', 'c_12#8D', 'c_33#9D', 'c_88#3C', 'c_90#2S'])
}

const highPlayer2 = {
  id: 'player11',
  hand: Deck.parse(['c_87#KH', 'c_12#7D', 'c_33#QS', 'c_88#2D', 'c_90#3D'])
}

/* Test each case */
describe('Poker Class Test', () => {
  test('`player1` should win with Royal Flush', () => {
    const winner = poker.winner([straightFlushPlayer, royalFlushPlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.ROYAL_FLUSH)
  })

  test('`player2` should win with Straight Flush', () => {
    const winner = poker.winner([straightFlushPlayer, fourKindPlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.STRAIGHT_FLUSH)
  })

  test('`player3` should win with Four of a Kind', () => {
    const winner = poker.winner([highPlayer, fourKindPlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.FOUR_OF_A_KIND)
  })

  test('`player4` should win with Full House', () => {
    const winner = poker.winner([onePlayer, fullHousePlayer, twoPlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.FULL_HOUSE)
  })

  test('`player5` should win with Flush', () => {
    const winner = poker.winner([highPlayer, twoPlayer, flushPlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.FLUSH)
  })

  test('`player6` should win with Straight', () => {
    const winner = poker.winner([highPlayer, twoPlayer, straightPlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.STRAIGHT)
  })

  test('`player7` should win with Three of a Kind', () => {
    const winner = poker.winner([twoPlayer, threeKindPlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.THREE_OF_A_KIND)
  })

  test('`player8` should win with Two Pairs', () => {
    const winner = poker.winner([twoPlayer, highPlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.TWO_PAIR)
  })

  test('`player9` should win with One Pair', () => {
    const winner = poker.winner([highPlayer, onePlayer])
    expect(winner[0].handRank).toEqual(Poker.RANKING.PAIR)
  })

  test('`player10` should win with High Card', () => {
    const winner = poker.winner([highPlayer, highPlayer2])
    expect(winner[0].handRank).toEqual(Poker.RANKING.HIGH_CARD)
  })
})
