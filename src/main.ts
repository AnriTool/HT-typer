import htwords from './assets/jshttp.json'

import {Word} from './game/word.ts'
import {Keyboard} from "./game/keyboard.ts";
import {Char} from "./game/char.ts";

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

let word: Word;

function scaleKeyboardElem(char: string,scaleFactor: number) {
	document.getElementById(`keyboard_${char.toLowerCase()}`).style.scale = scaleFactor.toString();
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
	if (true !== pressedKeys[event.code]) {
		pressedKeys[event.code] = true;
		new Audio(`./assets/audio/${getRandomInt(3)}.mp3`).play();

		if (event.code.includes('Key')) {
			const key = event.code.slice(-1).toLowerCase();
			scaleKeyboardElem(key,1.25);

			if (key === word.word[0]) {
				const el = word.getElement().childNodes[word.getElement().childNodes.length - word.word.length] as HTMLElement;
				el.style =
					'filter: grayscale(100%) brightness(80%) sepia(100%) hue-rotate(68deg) saturate(500%);'
				word.word.shift();

				if (true === GAME_STARTED) {
					scoreElement.textContent = String(Number(scoreElement.textContent) + 1);
				}
			}
			else {
				mistakesElement.textContent = String(Number(mistakesElement.textContent) + 1);
			}

			if (0 === word.word.length) {
				restartWord();

				if (false == GAME_STARTED) {
					mistakesElement.textContent = '0';
					scoreElement.textContent    = '0';
					GAME_STARTED                = true;
				}
			}

			typeCharReset()
		}
		else if ('Space' === event.code) {
			document.getElementById('keyboard_space').style.scale = '1.25';
		}
	}
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
	pressedKeys[event.code] = false;

	if (event.code.includes('Key')) {
		scaleKeyboardElem(event.code.slice(-1),1);
	}
	else if ('Space' === event.code) {
		scaleKeyboardElem('space',1);
	}
})

function animateElementDown(element: HTMLElement, targetPosition: number, resetGame: () => void): void {
	const startPosition = element.offsetTop;
	const distance = targetPosition - startPosition;
	const duration = 7 * 1000;
	let startTime: number | null = null;

	const step = (timestamp: number) => {
		if (false === document.body.contains(element)) {
			return
		}

		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;
		const progress = Math.min(elapsed / duration, 1);

		element.style.top = `${startPosition + distance * progress}px`;

		if (progress < 1) {
			requestAnimationFrame(step);
		} else {
			resetGame();
		}
	};

	requestAnimationFrame(step);
}

function restartWord(){
	paperElement.removeChild(word.getElement())
	word = new Word(htwords[getRandomInt(htwords.length)].toLowerCase());
	paperElement.appendChild(word.getElement());

	animateElementDown(word.getElement(), 268, ()=> {
		restartGame();
		typeCharReset()
	})
}

function startGame () {
	word = new Word('start');

	word.getElement().style.top = '46.3%'

	paperElement.appendChild(word.getElement());
}

function restartGame () {
	paperElement.removeChild(word.getElement())
	word         = new Word('restart');
	GAME_STARTED = false;
	paperElement.appendChild(word.getElement());
	word.getElement().style.top = '46.3%'
}

function typeCharReset() {
	typeThisElement.firstChild.remove();

	const char      = new Char(word.word[0]).getElement();
	char.className += ' type-this-char'

	typeThisElement.appendChild(char)
}

const paperElement = document.getElementById('paper');

const typeThisElement = document.getElementById('type');

const mistakesElement = document.getElementById('mistakes');

const scoreElement = document.getElementById('score');

let GAME_STARTED = false;

new Keyboard()

const pressedKeys: { [key: string]: boolean } = {};

startGame();

typeCharReset()















