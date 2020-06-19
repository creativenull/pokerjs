const Deck = require('deckjs')

/**
 * The base poker class to give players cards from the deck, replace those
 * cards from the hand, and solve each hand to produce to winner from a number
 * of players.
 *
 * Rankings from https://www.cardplayer.com/rules-of-poker/hand-rankings
 * Tie breaker rules: https://www.pokerhands.com/poker_hand_tie_rules.html
 * Prize factor: https://www.scientificpsychic.com/alpha/games/poker-js.html
 */
class Poker extends Deck {
  static get RANKING () {
    return {
      ROYAL_FLUSH: 9,
      STRAIGHT_FLUSH: 8,
      FOUR_OF_A_KIND: 7,
      FULL_HOUSE: 6,
      FLUSH: 5,
      STRAIGHT: 4,
      THREE_OF_A_KIND: 3,
      TWO_PAIR: 2,
      PAIR: 1,
      HIGH_CARD: 0,
      NONE: -1
    }
  }

  constructor (preShuffle = true) {
    super(preShuffle)
  }

  /**
   * Get new hands
   */
  getPlayerHand () {
    return this.getCards(5)
  }

  /**
   * Replace a card with a new one, return a new hand and the new card
   *
   * @param {Object} card
   * @param {Array} hand
   *
   * @returns
   */
  replace (card, hand) {
    const cardIndex = hand.findIndex(handCard => card.id === handCard.id)
    const [newCard] = this.getCards(1)
    const newHand = hand.slice(0)
    newHand.splice(cardIndex, 1, newCard)
    return [newHand, newCard]
  }

  /**
   * Returns the winner from the array
   *
   * @param {Array} players List of players in the session
   *
   * @returns An array of winning hand, starting from the highest rank
   */
  winner (players) {
    const list = players.map(player => {
      const hand = this.sort(player.hand)
      const { id } = player
      const { pairs, rank: pairRank } = this._getPairs(hand)

      const { check: isS, straightRank } = this._isStraight(hand)
      const { check: isF, flushRank } = this._isFlush(hand)
      const isSF = isS && isF
      const hasAce = this._hasAce(hand)
      const isFK = this._isFourOfAKind(pairs)
      const isFH = this._isFullHouse(pairs)
      const isTK = this._isThreeOfAKind(pairs)
      const is2P = this._isTwoPair(pairs)
      const is1P = this._isPair(pairs)

      if (isSF) {
        if (hasAce) {
          return {
            id,
            handRank: Poker.RANKING.ROYAL_FLUSH,
            handRankKey: 'ROYAL_FLUSH',
            tieBreakerCardRank: 0,
            name: 'Royal Flush'
          }
        } else {
          return {
            id,
            handRank: Poker.RANKING.STRAIGHT_FLUSH,
            handRankKey: 'STRAIGHT_FLUSH',
            tieBreakerCardRank: straightRank,
            name: 'Straight Flush'
          }
        }
      } else if (isFK) {
        return {
          id,
          handRank: Poker.RANKING.FOUR_OF_A_KIND,
          handRankKey: 'FOUR_OF_A_KIND',
          tieBreakerCardRank: pairRank,
          name: 'Four-of-a-Kind'
        }
      } else if (isFH) {
        return {
          id,
          handRank: Poker.RANKING.FULL_HOUSE,
          handRankKey: 'FULL_HOUSE',
          tieBreakerCardRank: pairRank,
          name: 'Full House'
        }
      } else if (isF) {
        return {
          id,
          handRank: Poker.RANKING.FLUSH,
          handRankKey: 'FLUSH',
          tieBreakerCardRank: flushRank,
          name: 'Flush'
        }
      } else if (isS) {
        return {
          id,
          handRank: Poker.RANKING.STRAIGHT,
          handRankKey: 'STRAIGHT',
          tieBreakerCardRank: straightRank,
          name: 'Straight'
        }
      } else if (isTK) {
        return {
          id,
          handRank: Poker.RANKING.THREE_OF_A_KIND,
          handRankKey: 'THREE_OF_A_KIND',
          tieBreakerCardRank: pairRank,
          name: 'Three-of-a-Kind'
        }
      } else if (is2P) {
        return {
          id,
          handRank: Poker.RANKING.TWO_PAIR,
          handRankKey: 'TWO_PAIR',
          tieBreakerCardRank: pairRank,
          name: 'Two Pair'
        }
      } else if (is1P) {
        return {
          id,
          handRank: Poker.RANKING.PAIR,
          handRankKey: 'PAIR',
          tieBreakerCardRank: pairRank,
          name: 'Pair'
        }
      } else {
        return {
          id,
          handRank: Poker.RANKING.HIGH_CARD,
          handRankKey: 'HIGH_CARD',
          tieBreakerCardRank: hand[0].rank,
          // Total rank of all other cards, except the first card
          tieBreakerTotalRank: hand.reduce((acc, card) => acc + card.rank, 0) - hand[0].rank,
          name: 'High Card'
        }
      }
    })

    return list.sort(this._sortWinnerHand)
  }

  _sortWinnerHand (player, nextPlayer) {
    if (player.handRank === nextPlayer.handRank) {
      // In the event the hand ranks are the same, sort by the highest tie breaker card
      if (player.tieBreakerCardRank !== nextPlayer.tieBreakerCardRank) {
        return nextPlayer.tieBreakerCardRank - player.tieBreakerCardRank
      } else {
        // Tie
        if (player.handRank === Poker.RANKING.HIGH_CARD) {
          // if it was a high card tie then determine by total rank
          return nextPlayer.tieBreakerTotalRank - player.tieBreakerTotalRank
        }
      }
    } else {
      // By default we sort by the hand rank with the highest number
      return nextPlayer.handRank - player.handRank
    }
  }

  /**
   * Checks if the hand and an ace card, since it is already sorted
   * we only check the first element
   *
   * @param {Array} hand
   *
   * @returns {boolean}
   */
  _hasAce (hand) {
    return hand[0].value === 'A'
  }

  /**
   * Checks of the hand is a sequence of card ranks
   *
   * @param {Array} hand
   *
   * @returns
   */
  _isStraight (hand) {
    for (let i = 0; i < hand.length - 1; i++) {
      if ((hand[i].rank - hand[i + 1].rank) === 1) {
        continue
      } else {
        // Not a Straight hand
        return {
          check: false,
          straightRank: 0
        }
      }
    }

    return {
      check: true,
      straightRank: hand[0].rank
    }
  }

  /**
   * Checks if the hand has the same card suit
   *
   * @param hand Array of card object
   *
   * @returns
   */
  _isFlush (hand) {
    for (const suit of Deck.SUITS) {
      const count = hand.reduce((acc, card) => acc + (card.suit.value === suit.value), 0)

      if (count === 5) {
        // Count of the same suit must be 5
        return {
          check: true,
          flushRank: hand[0].rank
        }
      }
    }

    // Not a flush hand
    return {
      check: false,
      flushRank: 0
    }
  }

  /**
   * Generates a two item array of pairs
   *
   * @param {object[]} hand Array of card object
   *
   * @returns
   */
  _getPairs (hand) {
    const pairs = []
    let rank = 0

    // Count the hand for pairs and get the highest rank of that pairs
    for (const cardValue of Deck.CARDS) {
      // Filter results of pair matches
      const countedCards = hand.filter((card) => card.value === cardValue)
      const count = countedCards.length

      if (count === 4) {
        // If the count of the same number was 4 then we only need that pair, break.
        pairs.push(count)
        rank = countedCards[0].rank
        break
      } else if (count === 3) {
        // If the count of the same number was 3 then we add to array and check next.
        pairs.push(count)
        rank = countedCards[0].rank
      } else if (count === 2) {
        // If the count of the same number was 2 then we check if the array length
        // is of size 2, since we only want 2-item array, making sure that the length
        // is consistent
        pairs.push(count)
        rank = countedCards[0].rank
        if (pairs.length === 2) {
          break
        }
      }
    }

    if (pairs.length === 1) {
      // We want to even the array items to make sure it is a 2-item array
      pairs.push(0)
    }

    return {
      pairs,
      rank
    }
  }

  /**
   * Checks if the pair is four of a kind
   *
   * @param {number[]} pairs Array of two number item
   *
   * @returns {boolean}
   */
  _isFourOfAKind (pairs) {
    return (pairs.length === 2) && (pairs[0] === 4) && (pairs[1] === 0)
  }

  /**
   * Checks if the pair is a full house
   *
   * @param {number[]} pairs Array of two number item
   *
   * @returns {boolean}
   */
  _isFullHouse (pairs) {
    return (pairs.length === 2) && ((pairs[0] + pairs[1]) === 5)
  }

  /**
   * Checks if the pair is three of a kind
   *
   * @param {number[]} pairs Array of two number item
   *
   * @returns {boolean}
   */
  _isThreeOfAKind (pairs) {
    return (pairs.length === 2) && (pairs[0] === 3) && (pairs[1] === 0)
  }

  /**
   * Checks if the pair is a two pair
   *
   * @param {number[]} pairs Array of two number item
   *
   * @returns {boolean}
   */
  _isTwoPair (pairs) {
    return (pairs.length === 2) && (pairs[0] === 2) && (pairs[1] === 2)
  }

  /**
   * Checks if the pair is a pair
   *
   * @param {number[]} pairs Array of two number item
   *
   * @returns {boolean}
   */
  _isPair (pairs) {
    return (pairs.length === 2) && (pairs[0] === 2) && (pairs[1] === 0)
  }
}

module.exports = Poker
