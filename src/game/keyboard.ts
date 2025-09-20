import {Char} from "./char.ts";

export class Keyboard {
	protected HTMLElement: HTMLElement;

	public constructor() {
		const chars = [
			['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
			['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
			['z', 'x', 'c', 'v', 'b', 'n', 'm'],
			['space']
		];

		this.HTMLElement = document.getElementById('keyboard');

		chars.forEach((line) => {
			this.createLine(line);
		})
	}

	public createLine(chars:Array<string>) {
		const listElement = document.createElement('div');

		chars.forEach((elem) => {
			const charElem = new Char(elem).getElement();
			charElem.id = `keyboard_${elem}`;
			charElem.className += ' keyboard_button'
			listElement.appendChild(charElem)
		})

		this.HTMLElement.appendChild(listElement);
	}

	public getElement() :HTMLElement {
		return this.HTMLElement;
	}
}