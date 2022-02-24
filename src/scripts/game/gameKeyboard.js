'use strict';

export class GameKeyboard {
  constructor(keyboardKeys) {
    this.keyboardKeys = [...keyboardKeys];
  }

  setKeyState(key, state) {
    let keyboardKey = this.getKey(key);
    
    if(this.getKeyState(key) !== "correct") {
      keyboardKey.dataset.state = state;
    }
  }

  getKeyState(key) {
    let keyboardKey = this.getKey(key);
    return keyboardKey.dataset.state;
  }

  getKey(key) {
    return this.keyboardKeys.find((keyboardKey) => {
      return keyboardKey.dataset.key === key;
    });
  }

  clearKeyState() {
    this.keyboardKeys.forEach((keyboardKey) => {
      keyboardKey.dataset.state = "tbd";
    });
  }
}