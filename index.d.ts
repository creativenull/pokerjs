import { Deck, Card } from 'deckjs'

export type Player = {
  id: string;
  hand: Card[];
}

export type PlayerResult = {
  id: string;
  handRank: number;
  handRankKey: PokerHandKey;
  tieBreakerCardRank: number;
  name: PokerHandText;
  tieBreakerTotalRank?: number;
}

export type PokerHandText = ('Royal Flush' | 'Straight Flush' | 'Four-of-a-Kind' | 'Full House' | 'Flush' | 'Straight' |
                             'Three-of-a-Kind' | 'Two Pair' | 'Pair' | 'High Card')

export type PokerHandKey = ('ROYAL_FLUSH' | 'STRAIGHT_FLUSH' | 'FOUR_OF_A_KIND' | 'FULL_HOUSE' | 'FLUSH' | 'STRAIGHT' |
                             'THREE_OF_A_KIND' | 'TWO_PAIR' | 'PAIR' | 'HIGH_CARD' | 'NONE')

export type PokerHandRanking = {
  ROYAL_FLUSH: number;
  STRAIGHT_FLUSH: number;
  FOUR_OF_A_KIND: number;
  FULL_HOUSE: number;
  FLUSH: number;
  STRAIGHT: number;
  THREE_OF_A_KIND: number;
  TWO_PAIR: number;
  PAIR: number;
  HIGH_CARD: number;
  NONE: number;
}

export type _StraightCheck = {
  check: boolean;
  straightRank: number;
}

export type _FlushCheck = {
  check: boolean;
  flushRank: number;
}

export type _PairsCheck = {
  pairs: number[];
  rank: number;
}

declare class Poker extends Deck {
  static get RANKING (): PokerHandRanking

  constructor (preShuffle: boolean = true)

  /**
   * Get cards dealt from the deck
   *
   * @returns {Card[]}
   */
  getPlayerHand (): Card[]

  /**
   * Replace a card with a new one, return a new hand and the new card
   *
   * @param {Card} card
   * @param {Card[]} hand
   *
   * @returns {[Card[], Card]}
   */
  replace (card: Card, hand: Card[]): [Card[], Card]

  /**
   * Returns the winner from the array
   *
   * @param {Player[]} players List of players in the session
   *
   * @returns {PlayerResult[]} An array of winning hand, starting from the highest rank
   */
  winner (players: Player[]): PlayerResult[]

  /**
   * @param {PlayerResult} player
   * @param {PlayerResult} nextPlayer
   *
   * @returns {number}
   */
  private _sortWinnerHand (player: PlayerResult, nextPlayer: PlayerResult): number

  /**
   * Checks if the hand and an ace card, since it is already sorted
   * we only check the first element
   *
   * @param {Card[]} hand
   *
   * @returns {boolean}
   */
  private _hasAce (hand: Card[]): boolean

  /**
   * Checks of the hand is a sequence of card ranks
   *
   * @param {Card[]} hand
   *
   * @returns {_StraightCheck}
   */
  private _isStraight (hand: Card[]): _StraightCheck

  /**
   * Checks if the hand has the same card suit
   *
   * @param {Card[]} hand
   *
   * @returns {_FlushCheck}
   */
  private _isFlush (hand: Card[]): _FlushCheck

  /**
   * Generates a two item array of pairs
   *
   * @param {Card[]} hand
   *
   * @returns {_PairsCheck}
   */
  private _getPairs (hand: Card[]): _PairsCheck

  /**
   * Checks if the pair is four of a kind
   *
   * @param {number[]} pairs
   *
   * @returns {boolean}
   */
  private _isFourOfAKind (pairs: number[]): boolean

  /**
   * Checks if the pair is a full house
   *
   * @param {number[]} pairs
   *
   * @returns {boolean}
   */
  private _isFullHouse (pairs: number[]): boolean

  /**
   * Checks if the pair is three of a kind
   *
   * @param {number[]} pairs
   *
   * @returns {boolean}
   */
  private _isThreeOfAKind (pairs: number[]): boolean

  /**
   * Checks if the pair is a two pair
   *
   * @param {number[]} pairs
   *
   * @returns {boolean}
   */
  private _isTwoPair (pairs: number[]): boolean

  /**
   * Checks if the pair is a pair
   *
   * @param {number[]} pairs
   *
   * @returns {boolean}
   */
  private _isPair (pairs: number[]): boolean
}
