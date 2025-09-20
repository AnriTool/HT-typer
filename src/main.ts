import htwords from './assets/jshttp.json'
import regwords from './assets/words.json'
import { Word } from './game/word.ts'
import { Keyboard } from "./game/keyboard.ts";
import { CharAtlas } from './game/char-atlas.ts';
import { AnimationManager } from './utils/animation.ts';
import { AudioManager } from './utils/audio.ts';
import type { GameState, PressedKeys, GameConfig } from './types/game.ts';

// Константы игры
const GAME_CONFIG: GameConfig = {
	ANIMATION_DURATION: 7000, // 7 секунд
	TARGET_POSITION: 268,
	START_POSITION: 46.3, // в процентах
	KEYBOARD_SCALE: 1.25,
	KEYBOARD_NORMAL_SCALE: 1,
	RANDOM_AUDIO_COUNT: 3
} as const;

// Утилиты
function getRandomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

// Основной класс игры
class Game {
	private state: GameState;
	private pressedKeys: PressedKeys;
	private keyboard: Keyboard;
	private paperElement: HTMLElement;
	private typeThisElement: HTMLElement;
	private mistakesElement: HTMLElement;
	private scoreElement: HTMLElement;
	private wordsListElement: HTMLElement;

	constructor() {
		this.state = {
			isStarted: false,
			score: 0,
			mistakes: 0,
			currentWord: null,
			wordList: regwords,
		};
		
		this.pressedKeys = {};
		this.keyboard = new Keyboard();
		
		// Получаем DOM элементы
		this.paperElement = this.getElement('paper');
		this.typeThisElement = this.getElement('type');
		this.mistakesElement = this.getElement('mistakes');
		this.scoreElement = this.getElement('score');
		this.wordsListElement = this.getElement('words-list');

		this.mistakesElement.firstChild.remove();
		this.mistakesElement.appendChild(new Word('0','word-static').getElement())

		this.scoreElement.firstChild.remove();
		this.scoreElement.appendChild(new Word('0','word-static').getElement())

		this.wordsListElement.firstChild.remove();
		this.wordsListElement.appendChild(new Word('regular', 'word-static').getElement())


		this.initializeGame();
	}

	private async initializeGame(): Promise<void> {
		// Предзагружаем звуки
		const soundPaths = Array.from({ length: GAME_CONFIG.RANDOM_AUDIO_COUNT }, (_, i) => `./assets/audio/${i}.mp3`);
		try {
			await AudioManager.preloadSounds(soundPaths);
		} catch (error) {
			console.warn('Не удалось предзагрузить все звуки:', error);
		}

		this.setupEventListeners();
		this.startGame();
	}

	private getElement(id: string): HTMLElement {
		const element = document.getElementById(id);
		if (!element) {
			throw new Error(`Element with id '${id}' not found`);
		}
		return element;
	}

	private setupEventListeners(): void {
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
		this.wordsListElement.addEventListener('click', this.changeWordsList.bind(this));
	}

	private handleKeyDown(event: KeyboardEvent): void {
		if (this.pressedKeys[event.code]) return;
		
		this.pressedKeys[event.code] = true;
		this.playRandomSound();

		if (event.code.includes('Key')) {
			const key = event.code.slice(-1).toLowerCase();
			this.keyboard.highlightKey(key, GAME_CONFIG.KEYBOARD_SCALE);
			this.handleLetterInput(key);
		} else if (event.code === 'Space') {
			this.keyboard.highlightKey('space', GAME_CONFIG.KEYBOARD_SCALE);
		}
	}

	private handleKeyUp(event: KeyboardEvent): void {
		this.pressedKeys[event.code] = false;

		if (event.code.includes('Key')) {
			this.keyboard.resetKey(event.code.slice(-1).toLowerCase());
		} else if (event.code === 'Space') {
			this.keyboard.resetKey('space');
		}
	}

	private changeWordsList(): void {
		if (this.state.wordList[0] == 'regular') {
			this.state.wordList = htwords;
			this.wordsListElement.firstChild.remove();
			this.wordsListElement.appendChild(new Word(this.state.wordList[0], 'word-static').getElement())
		}
		else {
			this.state.wordList = regwords;
			this.wordsListElement.firstChild.remove();
			this.wordsListElement.appendChild(new Word(this.state.wordList[0], 'word-static').getElement())
		}
	}

	private playRandomSound(): void {
		const soundPath = `./assets/audio/${getRandomInt(GAME_CONFIG.RANDOM_AUDIO_COUNT)}.mp3`;
		AudioManager.playSound(soundPath, 0.7);
	}

	private handleLetterInput(key: string): void {
		if (!this.state.currentWord) return;

		if (key === this.state.currentWord.getCurrentLetter()) {
			this.state.currentWord.markLetterAsTyped();
			this.updateScore();
		} else {
			if (this.state.isStarted) {
				this.incrementMistakes();
			}
		}

		if (this.state.currentWord.isComplete()) {
			this.restartWord();
			if (!this.state.isStarted) {
				this.startScoring();
			}
		}

		this.updateTypeChar();
	}

	private updateScore(): void {
		if (this.state.isStarted) {
			this.state.score++;

			this.scoreElement.firstChild.remove();
			this.scoreElement.appendChild(new Word(this.state.score.toString(),'word-static').getElement())
		}
	}

	private incrementMistakes(): void {
		this.state.mistakes++;

		this.mistakesElement.firstChild.remove();
		this.mistakesElement.appendChild(new Word(this.state.mistakes.toString(),'word-static').getElement())
	}

	private startScoring(): void {
		this.state.isStarted = true;
		this.state.mistakes = 0;
		this.state.score = 0;

		this.mistakesElement.firstChild.remove();
		this.mistakesElement.appendChild(new Word('0','word-static').getElement())

		this.scoreElement.firstChild.remove();
		this.scoreElement.appendChild(new Word('0','word-static').getElement())
	}

	private updateTypeChar(): void {
		if (!this.state.currentWord) return;

		// Очищаем предыдущий символ
		while (this.typeThisElement.firstChild) {
			this.typeThisElement.firstChild.remove();
		}

		// Добавляем новый символ для ввода
		const char = new CharAtlas(this.state.currentWord.getCurrentLetter()).getElement();
		char.className += ' type-this-char';
		this.typeThisElement.appendChild(char);
	}

	private animateElementDown(element: HTMLElement, targetPosition: number, onComplete: () => void): void {
		const startPosition = element.offsetTop;
		
		AnimationManager.animateElement(
			element,
			'top',
			startPosition,
			targetPosition,
			GAME_CONFIG.ANIMATION_DURATION,
			onComplete
		);
	}

	private restartWord(): void {
		if (this.state.currentWord) {
			this.paperElement.removeChild(this.state.currentWord.getElement());
		}

		const randomWord = this.state.wordList[getRandomInt(this.state.wordList.length)].toLowerCase();
		this.state.currentWord = new Word(randomWord);
		this.paperElement.appendChild(this.state.currentWord.getElement());

		this.animateElementDown(this.state.currentWord.getElement(), GAME_CONFIG.TARGET_POSITION, () => {
			this.restartGame();
			this.updateTypeChar();
		});
	}

	private startGame(): void {
		this.state.currentWord = new Word('start');
		this.state.currentWord.getElement().style.top = `${GAME_CONFIG.START_POSITION}%`;
		this.paperElement.appendChild(this.state.currentWord.getElement());
		this.updateTypeChar();
	}

	private restartGame(): void {
		if (this.state.currentWord) {
			this.paperElement.removeChild(this.state.currentWord.getElement());
		}
		
		this.state.currentWord = new Word('restart');
		this.state.isStarted = false;
		this.paperElement.appendChild(this.state.currentWord.getElement());
		this.state.currentWord.getElement().style.top = `${GAME_CONFIG.START_POSITION}%`;
	}
}

// Инициализация игры
new Game();
















