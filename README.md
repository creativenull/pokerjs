# Poker.js
A simple card poker library written in JavaScript.

## Installation

```sh
npm i @creativenull/pokerjs
# OR
yarn add @creativenull/pokerjs
```

## Test

```sh
npm run test
# OR
yarn test
```

## Usage

```ts
import { Poker } from "@creativenull/pokerjs";

const poker = new Poker();
const player1 = { id: "player1", hand: poker.getPlayerHand() };
const player2 = { id: "player2", hand: poker.getPlayerHand() };

const winner = poker.winner([player1, player2]);
console.log(winner);
```
