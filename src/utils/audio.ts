// Менеджер звуков
export class AudioManager {
	private static audioCache = new Map<string, HTMLAudioElement>();
	private static isEnabled = true;

	static async preloadSounds(soundPaths: string[]): Promise<void> {
		const loadPromises = soundPaths.map(path => this.loadSound(path));
		await Promise.all(loadPromises);
	}

	static async loadSound(path: string): Promise<HTMLAudioElement> {
		if (this.audioCache.has(path)) {
			return this.audioCache.get(path)!;
		}

		return new Promise((resolve, reject) => {
			const audio = new Audio(path);
			audio.preload = 'auto';
			
			audio.addEventListener('canplaythrough', () => {
				this.audioCache.set(path, audio);
				resolve(audio);
			});

			audio.addEventListener('error', () => {
				console.warn(`Не удалось загрузить звук: ${path}`);
				reject(new Error(`Failed to load audio: ${path}`));
			});

			audio.load();
		});
	}

	static playSound(path: string, volume: number = 1): void {
		if (!this.isEnabled) return;

		try {
			const audio = this.audioCache.get(path);
			if (audio) {
				audio.volume = volume;
				audio.currentTime = 0;
				audio.play().catch(error => {
					console.warn('Не удалось воспроизвести звук:', error);
				});
			} else {
				// Fallback для звуков, которые не были предзагружены
				const fallbackAudio = new Audio(path);
				fallbackAudio.volume = volume;
				fallbackAudio.play().catch(error => {
					console.warn('Не удалось воспроизвести звук:', error);
				});
			}
		} catch (error) {
			console.warn('Ошибка воспроизведения звука:', error);
		}
	}

	static setEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
	}

	static isAudioEnabled(): boolean {
		return this.isEnabled;
	}

	static clearCache(): void {
		this.audioCache.clear();
	}
}
