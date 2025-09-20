import { Char } from './char.ts';

export class Word {
	private readonly word: string[];
	private readonly element: HTMLDivElement;
	private currentIndex: number = 0;

	constructor(word: string) {
		this.word = Array.from(word);
		this.element = document.createElement('div');
		this.element.className = 'word';

		// Создаем элементы для каждого символа
		for (const char of word) {
			this.element.appendChild(new Char(char).getElement());
		}
	}

	public getElement(): HTMLElement {
		return this.element;
	}

	public getCurrentLetter(): string {
		return this.word[this.currentIndex] || '';
	}

	public markLetterAsTyped(): void {
		if (this.currentIndex < this.word.length) {
			const charElement = this.element.childNodes[this.currentIndex] as HTMLElement;
			if (charElement) {
				charElement.style.filter = 
					'grayscale(100%) brightness(80%) sepia(100%) hue-rotate(68deg) saturate(500%)';
			}
			this.currentIndex++;
		}
	}

	public isComplete(): boolean {
		return this.currentIndex >= this.word.length;
	}

	public getWord(): string {
		return this.word.join('');
	}

	public getRemainingLetters(): string[] {
		return this.word.slice(this.currentIndex);
	}

	public reset(): void {
		this.currentIndex = 0;
		// Сбрасываем стили всех символов
		for (let i = 0; i < this.element.childNodes.length; i++) {
			const charElement = this.element.childNodes[i] as HTMLElement;
			if (charElement) {
				charElement.style.filter = '';
			}
		}
	}
}