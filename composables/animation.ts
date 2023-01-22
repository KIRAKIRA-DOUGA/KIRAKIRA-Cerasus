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
			// BUG: 取消之前的所有动画。这里会报个错，不影响运行，但就是控制台大片红色很不爽。
			// Uncaught (in promise) DOMException: The user aborted a request.
			// 哪位懂王帮忙看一下把这个傻逼报错吞掉？
			// setTimeout(() => console.clear(), 10);
			// nextAnimationTick().then(() => console.clear()); // 已 “解决” bug。
			// 开发阶段这些给自己人看的没必要清除吧...
		}
	}
	return hasExistAnimations;
}

/**
 * 等待下一时刻 CSS 动画更新刷新。
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
