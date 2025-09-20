export class Char {
	protected HTMLElement: HTMLImageElement;

	public constructor(char: string) {
		if (' ' === char) {
			char = 'empty'
		}
		this.HTMLElement           = document.createElement('img')
		this.HTMLElement.src       = `./assets/chars/${char.toUpperCase()}.png`;
		this.HTMLElement.className = 'character'
	}

	public getElement() :HTMLElement {
		return this.HTMLElement;
	}
}