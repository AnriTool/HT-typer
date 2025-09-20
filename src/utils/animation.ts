// Утилиты для анимации
export class AnimationManager {
	private static activeAnimations = new Set<number>();

	static animateElement(
		element: HTMLElement,
		property: string,
		startValue: number,
		endValue: number,
		duration: number,
		onComplete?: () => void
	): void {
		if (!document.body.contains(element)) {
			return;
		}

		let startTime: number | null = null;

		const step = (timestamp: number) => {
			if (!document.body.contains(element)) {
				return;
			}

			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);

			const currentValue = startValue + (endValue - startValue) * progress;
			element.style.setProperty(property, `${currentValue}px`);

			if (progress < 1) {
				const animationId = requestAnimationFrame(step);
				this.activeAnimations.add(animationId);
			} else {
				onComplete?.();
			}
		};

		const animationId = requestAnimationFrame(step);
		this.activeAnimations.add(animationId);
	}

	static cancelAllAnimations(): void {
		this.activeAnimations.forEach(id => cancelAnimationFrame(id));
		this.activeAnimations.clear();
	}

	static easeOut(t: number): number {
		return 1 - Math.pow(1 - t, 3);
	}
}
