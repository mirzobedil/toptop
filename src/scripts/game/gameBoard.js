'use strict';

import { GameTile } from "./gameTile.js";

export class GameBoard {
  constructor(width, height, tileElements) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.initGameBoard(tileElements);
  }

  initGameBoard(tileElements) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const tile = new GameTile(tileElements[i * this.width + j]);
        this.tiles.push(tile);
      }
    }
  }

  getTile(x, y) {
    return this.tiles[x * this.width + y];
  }

  getTileFromIndex(i) {
    return this.tiles[i];
  }

  getRowWord(row) {
    let word = '';
    for (let i = 0; i < this.width; i++) {
      const tile = this.getTile(row, i);
      word += tile.getTileLetter();
    }

    return word;
  }

  clearGameBoard() {
    this.tiles.forEach(tile => {
      tile.clearTile();
    })
  }
}