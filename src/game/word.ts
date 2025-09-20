import {Char} from './char.ts';

export class Word {
	public word: Array<string>;
	protected HTMLElement: HTMLDivElement;

	public constructor(word: string) {
		this.word                  = Array.from(word);
		this.HTMLElement           = document.createElement('div')
		this.HTMLElement.className = 'word'

		for (const char of word) {
			this.HTMLElement.appendChild(new Char(char).getElement())
		}

	}

	public getElement() :HTMLElement {
		return this.HTMLElement;
	}
}