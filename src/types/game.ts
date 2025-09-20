// Типы для игры
export interface GameState {
	isStarted: boolean;
	score: number;
	mistakes: number;
	currentWord: Word | null;
	wordList: Array<string>;
}

export interface PressedKeys {
	[key: string]: boolean;
}

export interface GameConfig {
	ANIMATION_DURATION: number;
	TARGET_POSITION: number;
	START_POSITION: number;
	KEYBOARD_SCALE: number;
	KEYBOARD_NORMAL_SCALE: number;
	RANDOM_AUDIO_COUNT: number;
}

export interface AnimationOptions {
	duration: number;
	easing?: (t: number) => number;
	onComplete?: () => void;
}

export interface AudioOptions {
	volume?: number;
	loop?: boolean;
}

// Импортируем Word здесь, чтобы избежать циклических зависимостей
import type { Word } from '../game/word';
