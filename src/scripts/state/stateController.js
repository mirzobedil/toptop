'use strict';

import { StateObjects } from './stateObjects.js';

export class StateController {
  constructor(wordsController) {
    this.gameState = JSON.parse(JSON.stringify(StateObjects.gameState));
    this.gameStats = JSON.parse(JSON.stringify(StateObjects.gameStats));
    this.wordsController = wordsController;
    this.initStateController();
  }

  initStateController() {
    const lastState = this.readStateFromLocalStorage();
    const lastStats = this.readStatsFromLocalStorage();

    if(lastState) {
      this.setGameState(lastState);
      this.setGameStats(lastStats);

      if(this.getGuess() === "") {
        this.setGuess(this.wordsController.getRandomWord());
      }
    }
    else {
      this.setGuess(this.wordsController.getRandomWord());
      this.saveStatsToLocalStorage(this.gameStats);
    }
  }

  setGameState(state) {
    this.gameState = JSON.parse(JSON.stringify(state));
    this.saveStateToLocalStorage(this.gameState);
  }

  setStateLetters(letter) {
    this.gameState.letters.push(letter);
    this.saveStateToLocalStorage(this.gameState);
  }

  getStateLetters() {
    return this.gameState.letters;
  }

  setTileStates(state) {
    this.gameState.states.push(state);
    this.saveStateToLocalStorage(this.gameState);
  }

  getTileStates() {
    return this.gameState.states;
  }

  setGuess(word) {
    this.gameState.guess = word;
    this.saveStateToLocalStorage(this.gameState);
  }

  getGuess() {
    return this.gameState.guess;
  }

  getDecodedGuess() {
    return this.wordsController.getDecodedWord(this.getGuess());
  }

  setStatus(status) {
    this.gameState.status = status;
    this.saveStateToLocalStorage(this.gameState);
  }

  getStatus() {
    return this.gameState.status;
  }

  setLastPlayedTime(time) {
    this.gameState.lastPlayedTime = time;
    this.saveStateToLocalStorage(this.gameState);
  }

  getLastPlayedTime() {
    return this.gameState.lastPlayedTime;
  }

  saveStateToLocalStorage(state) {
    localStorage.setItem('gameState', JSON.stringify(state));
  }

  readStateFromLocalStorage() {
    return JSON.parse(localStorage.getItem('gameState'));
  }

  clearState() {
    this.setGameState(StateObjects.gameState);
    this.initStateController();
  }

  setGameStats(stats) {
    this.gameStats = JSON.parse(JSON.stringify(stats));
    this.saveStatsToLocalStorage(this.gameStats);
  }

  setPlaysCount() {
    this.gameStats.playsCount++;
    this.saveStatsToLocalStorage(this.gameStats);
  }

  getPlaysCount() {
    return this.gameStats.playsCount;
  }

  setWinsCount() {
    this.gameStats.winsCount++;
    this.saveStatsToLocalStorage(this.gameStats);
  }

  getWinsCount() {
    return this.gameStats.winsCount;
  }

  setAttempts(guess) {
    this.gameStats.attempts[guess]++;
    this.saveStatsToLocalStorage(this.gameStats);
  }

  getAttempts() {
    return this.gameStats.attempts;
  }

  setCurrentStreak(streak) {
    this.gameStats.currentStreak = streak;
    this.saveStatsToLocalStorage(this.gameStats);
  }

  getCurrentStreak() {
    return this.gameStats.currentStreak;
  }

  setMaxStreak() {
    this.gameStats.maxStreak = Math.max(this.gameStats.maxStreak, this.gameStats.currentStreak);
    this.saveStatsToLocalStorage(this.gameStats);
  }

  getMaxStreak() {
    return this.gameStats.maxStreak;
  }
  
  saveStatsToLocalStorage(stats) {
    localStorage.setItem('gameStats', JSON.stringify(stats));
  }

  readStatsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('gameStats'));
  }

  clearStats() {
    this.setStats(StateObjects.gameStats);
  }
}