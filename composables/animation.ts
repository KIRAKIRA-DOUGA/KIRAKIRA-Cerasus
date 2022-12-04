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
			// FIXME: 取消之前的所有动画。这里会报个错，不影响运行，但就是控制台大片红色很不爽。
			// Uncaught (in promise) DOMException: The user aborted a request.
		}
	}
	return hasExistAnimations;
}
