import { CharAtlas } from './char-atlas.ts';

export class Keyboard {
	private readonly element: HTMLElement;
	private readonly keyLayout: string[][];

	constructor() {
		this.keyLayout = [
			['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
			['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
			['z', 'x', 'c', 'v', 'b', 'n', 'm'],
			['space']
		];

		const keyboardElement = document.getElementById('keyboard');
		if (!keyboardElement) {
			throw new Error('Keyboard element not found');
		}
		this.element = keyboardElement;

		this.createKeyboard();
	}

	private createKeyboard(): void {
		this.keyLayout.forEach((row) => {
			this.createRow(row);
		});
	}

	private createRow(keys: string[]): void {
		const rowElement = document.createElement('div');
		rowElement.className = 'keyboard-row';

		keys.forEach((key) => {
			const keyElement = this.createKey(key);
			rowElement.appendChild(keyElement);
		});

		this.element.appendChild(rowElement);
	}

	private createKey(key: string): HTMLElement {
		const charElement = new CharAtlas(key).getElement();
		charElement.id = `keyboard_${key}`;
		charElement.className += ' keyboard_button';
		charElement.setAttribute('data-key', key);
		return charElement;
	}

	public getElement(): HTMLElement {
		return this.element;
	}

	public getKeyElement(key: string): HTMLElement | null {
		return document.getElementById(`keyboard_${key}`);
	}

	public highlightKey(key: string, scale: number = 1.25): void {
		const keyElement = this.getKeyElement(key);
		if (keyElement) {
			keyElement.style.scale = scale.toString();
		}
	}

	public resetKey(key: string): void {
		this.highlightKey(key, 1);
	}

	public resetAllKeys(): void {
		const keyElements = this.element.querySelectorAll('.keyboard_button');
		keyElements.forEach((keyElement) => {
			(keyElement as HTMLElement).style.scale = '1';
		});
	}
}