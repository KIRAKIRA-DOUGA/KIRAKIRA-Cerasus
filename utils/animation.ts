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

type StyleProperties = string & keyof FilterValueType<CSSStyleDeclaration, string>;
type Keyframes = Record<Exclude<StyleProperties, "offset">, string | number>[];

/**
 * 当高度值设为 auto 时的动画高度。
 * @param element - HTML DOM 元素。
 * @param changeFunc - 使高度将会改变的回调函数。
 * @returns 动画异步承诺。
 */
export function animateHeight(
	element: Element,
	changeFunc: (() => void) | undefined | null,
	{
		startHeight,
		endHeight,
		duration = 250,
		getSize,
	}: Partial<{
		/** 显式指定初始高度（可选）。 */
		startHeight: number;
		/** 显式指定结束高度（可选）。 */
		endHeight: number;
		/** 动画时间。 */
		duration: number;
		/**
		 * 获取最终的元素尺寸。
		 * @param result - 最终的元素尺寸。
		 */
		getSize: (result: [number, number]) => void;
	}>,
) {
	startHeight ??= element.clientHeight;
	changeFunc?.();
	endHeight ??= element.clientHeight;
	getSize?.([element.clientWidth, element.clientHeight]);
	if (startHeight === endHeight) return; // 不用动了。
	const keyframes = [
		{ height: startHeight + "px" },
		{ height: endHeight + "px" },
	] as Keyframes;
	let setPaddingIndex: number | undefined;
	if (startHeight === 0) setPaddingIndex = 0;
	if (endHeight === 0) setPaddingIndex = 1;
	if (setPaddingIndex !== undefined) {
		const setPaddingKeyframe = keyframes[setPaddingIndex];
		setPaddingKeyframe.paddingTop = 0;
		setPaddingKeyframe.paddingBottom = 0;
		setPaddingKeyframe.marginTop = 0;
		setPaddingKeyframe.marginBottom = 0;
	}
	return element.animate(keyframes, {
		duration,
		easing: eases.easeOutSmooth,
	}).finished;
}
