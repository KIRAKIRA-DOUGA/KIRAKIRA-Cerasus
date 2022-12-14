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
			// existAnimations.forEach(animation => console.log(animation.playState));
			existAnimations.forEach(animation => animation.finish());
			// existAnimations.forEach(animation => console.log(animation.playState));
			existAnimations.forEach(animation => animation.cancel());
			// BUG: 取消之前的所有动画。这里会报个错，不影响运行，但就是控制台大片红色很不爽。
			// Uncaught (in promise) DOMException: The user aborted a request.
			// 哪位懂王帮忙看一下把这个傻逼报错吞掉？
			// -
			// 使用 cancel()方法时如果 animation.playState 为 running 会报错
			// 取消注释上面那两行代码会向控制台输出了动画的播放状态
		}
	}
	return hasExistAnimations;
}
