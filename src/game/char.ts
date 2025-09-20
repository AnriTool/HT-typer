export class Char {
	private readonly element: HTMLImageElement;
	private readonly char: string;

	constructor(char: string) {
		this.char = char;
		this.element = document.createElement('img');
		this.element.className = 'character';
		this.element.alt = char; // Для доступности
		this.element.src = this.getImagePath(char);
		
		// Добавляем обработчик ошибок загрузки изображения
		this.element.addEventListener('error', () => {
			console.warn(`Не удалось загрузить изображение для символа: ${char}`);
			this.element.style.display = 'none';
		});
	}

	private getImagePath(char: string): string {
		// Обрабатываем специальные случаи
		const normalizedChar = char === ' ' ? 'SPACE' : char.toUpperCase();
		return `./assets/chars/${normalizedChar}.png`;
	}

	public getElement(): HTMLElement {
		return this.element;
	}

	public getChar(): string {
		return this.char;
	}

	public setScale(scale: number): void {
		this.element.style.scale = scale.toString();
	}

	public addClass(className: string): void {
		this.element.classList.add(className);
	}

	public removeClass(className: string): void {
		this.element.classList.remove(className);
	}

	public setStyle(property: string, value: string): void {
		this.element.style.setProperty(property, value);
	}

	public resetStyle(): void {
		this.element.style.cssText = '';
	}
}