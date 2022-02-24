'use strict';

export class GameTile {
  constructor(tileElement) {
    this.tileElement = tileElement;
    this.letterElement = this.tileElement.querySelector('p');
  }

  setTileLetter(letter) {
    this.letterElement.textContent = letter;
    this.tileElement.dataset.letter = letter;
  }
  
  getTileLetter() {
    return this.tileElement.dataset.letter;
  }

  setTileState(state) {
    this.tileElement.dataset.state = state;
  }

  clearTile() {
    this.tileElement.dataset.letter = '';
    this.tileElement.dataset.state = 'tbd';
    this.letterElement.textContent = '';
  }
}