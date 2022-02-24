'use strict';

export class WordsController {
  constructor(wordsList) {
    this.wordsList = wordsList;
  }

  getEncodedWord(word) {
    return window.btoa(word);
  }

  getDecodedWord(word) {
    return window.atob(word);
  }

  getRandomWord() {
    return this.getEncodedWord(this.wordsList[Math.floor(Math.random() * this.wordsList.length)]);
  }

  checkWordIsCorrect(word) {
    return this.wordsList.includes(word.toLowerCase());
  }

  getCharacterSizeInWord(word, letter) {
    let size = 0;
    for(let i = 0; i < word.length; i++) {
      if(word[i] === letter) {
        size += 1;
      }
    }
    return size;
  }
}