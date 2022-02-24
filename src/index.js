'use strict';

import { GameBoard } from "./scripts/game/gameBoard.js";
import { GameController } from "./scripts/game/gameController.js";
import { GameKeyboard } from "./scripts/game/gameKeyboard.js";
import { WordsController } from "./scripts/game/wordsController.js";
import { StateController } from "./scripts/state/stateController.js";

(async function () {
	const response = await fetch('https://mirzobedil.uz/games/toptop/data/wordsList.json');
	const data = await response.json();

	initGame(data.words);
})();

function initGame(words) {
	const themeToggle = document.querySelector('.theme-toggle');
	const helpBtn = document.querySelector('.help-btn');
	const statsBtn = document.querySelector('.stats-btn');
	const tileElements = document.querySelectorAll('.tile');
	const keyboardKeys = document.querySelectorAll('[data-key]');
	const enterKey = document.querySelector('[data-enter]');
	const deleteKey = document.querySelector('[data-delete]');

	const BOARD_WIDTH = 5;
	const BOARD_HEIGHT = 6;
	const TIMER_TIME = 1 * 60 * 1000;

	const gameKeyboard = new GameKeyboard(keyboardKeys);
	const wordsController = new WordsController(words);
	const stateController = new StateController(wordsController);
	const gameBoard = new GameBoard(BOARD_WIDTH, BOARD_HEIGHT, tileElements);
	const gameController = new GameController(gameBoard, stateController, wordsController, gameKeyboard, TIMER_TIME);
	
	gameController.initGameController();
	
	themeToggle.addEventListener('click', switchTheme);
	document.addEventListener('click', (e) => {
		if(e.target.matches('[data-key]')) {
			gameController.enterLetter(e.target.dataset.key);
		}
	});
	enterKey.addEventListener('click', () => { gameController.enterWord(); });
	deleteKey.addEventListener('click', () => { gameController.deleteLetter(); });
	helpBtn.addEventListener('click', () => { openModal(helpBtn.dataset.open, gameController); });
	statsBtn.addEventListener('click', () => { openModal(statsBtn.dataset.open, gameController); });
}

function switchTheme() {
	const theme = window.localStorage.getItem('theme');
	let newTheme = theme === 'dark' ? 'light' : 'dark';

	document.documentElement.dataset.theme = newTheme;
	window.localStorage.setItem('theme', newTheme);
}

function openModal(area, gameController) {
	const modal = document.querySelector(`[data-area='${area}']`);
	const modalDialog = modal.querySelector('.modal__dialog');
	const closeBtn = modal.querySelector('.modal__close');

	gameController.setStatsToModal();

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