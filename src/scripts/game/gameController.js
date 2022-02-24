'use strict';

export class GameController {
  constructor(gameBoard, stateController, wordsController, gameKeyboard, timerTime) {
    this.gameBoard = gameBoard;
    this.stateController = stateController;
    this.wordsController = wordsController;
    this.gameKeyboard = gameKeyboard;
    this.activeRow = 0;
    this.activeTile = 0;
    this.timerTime = timerTime;
  }

  initGameController() {
    if(this.stateController.getStateLetters().length !== 0) {
      this.readGameFromSavedState();
    }
    
    this.checkTimer();
  }

  readGameFromSavedState() {
    const letters = this.stateController.getStateLetters();
    const tileStates = this.stateController.getTileStates();

    for(let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      const letterState = tileStates[i];
      const tile = this.gameBoard.getTileFromIndex(i);
      
      tile.setTileLetter(letter);
      tile.setTileState(letterState);
      this.gameKeyboard.setKeyState(letter, letterState);
    }

    this.activeRow = Math.floor(letters.length / this.gameBoard.width);
  }

  pauseGame() {
    this.stateController.setStatus("pause");
  }

  resumeGame() {
    this.stateController.setStatus("play");
  }

  showToast(message) {
    const boardContainer = document.querySelector('.board-container');
    const currentToast = document.querySelector('.toast');
    const newToast = document.createElement('div');

    if(currentToast) { currentToast.remove(); }

    newToast.classList.add('toast');
    newToast.innerHTML = message;

    boardContainer.appendChild(newToast);
    setTimeout(() => {
      newToast.classList.add('show');
    }, 10);

    setTimeout(() => {
      newToast.classList.remove('show');
      setTimeout(() => {
        newToast.remove();
      }, 500);
    }, 3000);
  }

  enterLetter(letter) {
    if(this.activeTile < this.gameBoard.width && this.stateController.getStatus() === 'play') {
      const currentTile = this.gameBoard.getTile(this.activeRow, this.activeTile);
      const tileElement = currentTile.tileElement;

      tileElement.classList.add('enter');
      tileElement.addEventListener('animationend', () => {
        tileElement.classList.remove('enter');
      }, {once: true});

      currentTile.setTileLetter(letter);
      currentTile.setTileState('none');
      this.activeTile ++;
    }
  }

  deleteLetter() {
    if(this.activeTile != 0 && this.stateController.getStatus() === 'play') {
      const currentTile = this.gameBoard.getTile(this.activeRow, this.activeTile - 1);

      currentTile.setTileLetter('');
      currentTile.setTileState('tbd');
      this.activeTile --;
    }
  }

  enterWord() {
    if(this.activeTile !== this.gameBoard.width || this.stateController.getStatus() !== 'play') {
      return;
    }

    let word = this.gameBoard.getRowWord(this.activeRow);
    if(this.wordsController.checkWordIsCorrect(word)) {
      this.setTileStates(word);
    }
    else {
      this.showToast(`&#128528; <strong>${word}</strong> so'zi lug'atimizda yo'q!`);
    }
  }

  setTileStates(word) {
    this.pauseGame();

    for(let i = 0; i < word.length; i++) {
      const currentTile = this.gameBoard.getTile(this.activeRow, i);
      const tileElement = currentTile.tileElement;
      const guess = this.stateController.getDecodedGuess();
      const letter = word[i];
      let currentTileState = "none";

      if(letter === guess[i]) {
        currentTileState = "correct";
      }
      else if(guess.includes(letter)) {
        if(this.wordsController.getCharacterSizeInWord(word, letter) === 1){
          currentTileState = "include";
        }
        else if(this.wordsController.getCharacterSizeInWord(word, letter) === 2
        && this.wordsController.getCharacterSizeInWord(guess, letter) === 2) {
          currentTileState = "include";
        }
        else if(this.wordsController.getCharacterSizeInWord(word, letter) === 2 && word.indexOf(letter) !== i
        && guess[word.indexOf(letter)] !== letter) {
          currentTileState = "include";
        }
        else {
          currentTileState = "incorrect";
        }
      }
      else {
        currentTileState = "incorrect";
      }

      setTimeout(() => {
        tileElement.classList.add('check');
      }, i * 100);

      tileElement.addEventListener('transitionend', () => {
        tileElement.classList.remove('check');
        currentTile.setTileState(currentTileState);
        this.gameKeyboard.setKeyState(letter, currentTileState);
        this.stateController.setStateLetters(letter);
        this.stateController.setTileStates(currentTileState);

        tileElement.addEventListener('transitionend', () => {
          if(i === 4) {
            this.checkWinLose(word);
          }
        }, {once: true});
      }, {once: true});
    }
  }

  checkWinLose(word) {
    if(word === this.stateController.getDecodedGuess()) {
      this.setWinLose("win");
    }
    else if(this.activeRow === this.gameBoard.height - 1) {
      this.setWinLose("lose");
    }
    else {
      this.activeRow++;
      this.activeTile = 0;
      this.resumeGame();
    }
  }

  setWinLose(status) {
    let timeout = 0;

    this.stateController.setStatus(status);
    this.stateController.setPlaysCount();

    if(status === "win") {
      timeout = 2200;
      this.stateController.setAttempts(this.activeRow);
      this.stateController.setWinsCount();
      this.stateController.setCurrentStreak(this.stateController.getCurrentStreak() + 1);
      this.stateController.setMaxStreak();

      const guessWord = this.stateController.getDecodedGuess();

      guessWord.split('').forEach((letter, i) => {
        const tile = this.gameBoard.getTile(this.activeRow, i);
        const letterElement = tile.letterElement;

        setTimeout(() => {
          letterElement.classList.add('win');
        }, i * 100 + 500);

        letterElement.addEventListener('animationend', () => {
          letterElement.classList.remove('win');
        }, {once: true});
      });
    }
    else {
      timeout = 750;
      this.stateController.setCurrentStreak(0);
    }

    setTimeout(() => {
      this.stateController.setLastPlayedTime(new Date().getTime());
      this.checkTimer();
    }, timeout);
  }

  clearGame() {
    this.activeRow = 0;
    this.activeTile = 0;
    this.gameBoard.clearGameBoard();
    this.gameKeyboard.clearKeyState();
    this.stateController.clearState();
  }

  startCountDown() {
    const elapsedTime = new Date().getTime() - this.stateController.getLastPlayedTime();
    let timeLeft = this.timerTime - elapsedTime;

    this.writeTimerTime(this.getTimeString(timeLeft));
    this.showWinModal();
    
    const countdown = setInterval(() => {
      timeLeft -= 1000;
      if(Math.floor(timeLeft / 1000) >= 1) {
        this.writeTimerTime(this.getTimeString(timeLeft));
      }
      else {
        this.clearGame();
        this.resumeGame();
        this.clearModal();
        clearInterval(countdown);
      }
    }, 1000);
  }

  checkTimer() {
    const elapsedTime = new Date().getTime() - this.stateController.getLastPlayedTime();
    const gameSatus = this.stateController.getStatus();

    if(Math.floor((this.timerTime - elapsedTime) / 1000) > 1) {
      this.startCountDown();
    }
    else if(gameSatus === "win" || gameSatus === "lose") {
      this.clearGame();
    }
  }

  getTimeString(time) {
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }

  setStatsToModal() {
    const modalPlays = document.querySelector('.plays');
    const playItems = modalPlays.querySelectorAll('.value');
    const modalAttempts = document.querySelector('.attempts');
    const attemptBars = modalAttempts.querySelectorAll('.bar');

    const playsCount = this.stateController.getPlaysCount();
    const winsCount = this.stateController.getWinsCount();

    playItems[0].textContent = playsCount;
    playItems[1].textContent = playsCount === 0 ? '0%' : (Math.round(winsCount / playsCount * 100) + '%');
    playItems[2].textContent = this.stateController.getCurrentStreak();
    playItems[3].textContent = this.stateController.getMaxStreak();

    this.stateController.getAttempts().forEach((attempt, i) => {
      if(attempt !== 0) {
        const bar = attemptBars[i];
        const height = attempt / winsCount * 150 + 25;
        bar.dataset.number = attempt;
        bar.textContent = attempt;
        bar.style.height = height + 'px';
      }
    });
  }

  showWinModal() {
    this.setStatsToModal();

    const modal = document.querySelector(`[data-area='stats-modal']`);
    const modalDialog = modal.querySelector('.modal__dialog');
    const modalHeader = modalDialog.querySelector('.modal__header');
    const modalWord = modalDialog.querySelector('.modal__word');
    const closeBtn = modal.querySelector('.modal__close');
    const modalTimer = modalDialog.querySelector('.modal__timer');
    let wordStatus = '';

    modalWord.innerHTML = '';

    if(this.stateController.getStatus() === 'win') {
      modalHeader.innerHTML = "<strong>🎉 Tabriklaymiz dastur o'ylagan<br>so'zni topdingiz!</strong>";
      wordStatus = 'correct';
    }
    else if(this.stateController.getStatus() == 'lose') {
      modalHeader.innerHTML = "<strong>😐 Afsus dastur o'ylagan so'zni<br>topolmadingiz!</strong>";
    }

    this.stateController.getDecodedGuess().split('').forEach(letter => {
      modalWord.innerHTML += `<p class="${wordStatus}">${letter}</p>`
    });

    modalTimer.style.display = 'block';
    modal.dataset.hidden = 'false';

    modalDialog.classList.add('slide-in');
    modalDialog.addEventListener('animationend', () => {
      modalDialog.classList.remove('slide-in');
    }, {once: true});

    closeBtn.addEventListener('click', () => {
      modal.dataset.hidden = 'true';
    });
    modal.addEventListener('click', (e) => {
      if(e.target.matches('[data-area]')) {
        modal.dataset.hidden = 'true';
      }
    });
  }

  writeTimerTime(timeString) {
    const timerTime = document.querySelector('.timer-time');
    timerTime.textContent = timeString;
  }

  clearModal() {
    const modal = document.querySelector(`[data-area='stats-modal']`);
    const modalDialog = modal.querySelector('.modal__dialog');
    const modalHeader = modalDialog.querySelector('.modal__header');
    const modalWord = modalDialog.querySelector('.modal__word');
    const modalTimer = modalDialog.querySelector('.modal__timer');
    const timerTime = modalTimer.querySelector('.timer-time');

    modalDialog.classList.remove('slide-in');
    modal.dataset.hidden = 'true';
    timerTime.textContent = '00:00';
    modalTimer.style.display = 'none';
    modalHeader.innerHTML = '';
    modalWord.innerHTML = '';
  }
}