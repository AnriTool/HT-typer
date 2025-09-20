import { CharAtlas } from './char-atlas.ts';

export class Word {
	private readonly word: string[];
	private readonly element: HTMLDivElement;
	private currentIndex: number = 0;

	constructor(word: string, className:string = 'word') {
		this.word = Array.from(word);
		this.element = document.createElement('div');
		this.element.className = className;

		// Создаем элементы для каждого символа
		for (const char of word) {
			this.element.appendChild(new CharAtlas(char).getElement());
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
}