import atlasData from '../assets/atlas.json'

export class CharAtlas {
	private readonly element: HTMLElement;

	constructor(char: string) {
		this.element = document.createElement('div');
		this.element.className = 'character';

		const atlasChar = (atlasData as Record<string, {x:number, y:number, w:number, h:number}>)[char.toUpperCase()]

		this.element.style.setProperty('--sprite-x', `-${atlasChar.x + 2}px`)
		this.element.style.setProperty('--sprite-y', `-${atlasChar.y + 2}px`)
		this.element.style.setProperty('--sprite-h', `${atlasChar.h}px`)
		this.element.style.setProperty('--sprite-w', `${atlasChar.w}px`)

		// Добавляем обработчик ошибок загрузки изображения
		this.element.addEventListener('error', () => {
			console.warn(`Не удалось загрузить изображение для символа: ${char}`);
			this.element.style.display = 'none';
		});
	}

	public getElement(): HTMLElement {
		return this.element;
	}
}