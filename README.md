# Poker.js

A simple card poker library written in TypeScript.

## Installation

```sh
npm install @creativenull/pokerjs
```

### Deno

```ts
import { Poker } from "jsr:@creativenull/pokerjs@2";
```

## Test

```sh
npm run test
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
