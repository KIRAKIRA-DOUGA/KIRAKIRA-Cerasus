/**
 * 移除指定 DOM 元素正在进行的所有动画。
 * @param elements - HTML DOM 元素。
 * @returns 是否有移除动画。
 */
export function removeExistAnimations(...elements: Element[]) {
	let hasExistAnimations = false;
	for (const element of elements) {
		const existAnimations = element.getAnimations();
		if (existAnimations.length !== 0) {
			hasExistAnimations = true;
			existAnimations.forEach(animation => animation.cancel());
		}
	}
	return hasExistAnimations;
}

/**
 * 等待下一时刻 CSS 动画更新刷新。
 * @returns 空承诺。
 */
export function nextAnimationTick() {
	return new Promise<void>(resolve => {
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				resolve();
			});
		});
	});
}

/**
 * 重播 CSS 动画。
 * @param element - HTML DOM 元素。
 * @param className - 具有动画的 CSS 类名。
 */
export async function replayAnimation(element: Element, ...className: string[]) {
	element.classList.remove(...className);
	await nextAnimationTick();
	element.classList.add(...className);
}

/**
 * 当高度值设为 auto 时的动画高度。
 * @param element - HTML DOM 元素。
 * @param changeFunc - 使高度将会改变的回调函数。
 * @param startHeight - 指定初始高度（可选）。
 * @param duration - 动画时间。
 * @returns 动画异步承诺。
 */
export function animateHeight(
	element: Element,
	changeFunc: (() => void) | undefined | null,
	{
		startHeight,
		duration = 250,
	}: {
		startHeight?: number;
		duration?: number;
	},
) {
	startHeight ??= element.clientHeight;
	changeFunc?.();
	const endHeight = element.clientHeight;
	return element.animate([
		{ height: startHeight },
		{ height: endHeight + "px" },
	], {
		duration,
		easing: eases.easeOutMax,
	}).finished;
}
