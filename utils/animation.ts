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
 * 是否用户请求削弱动态效果？
 * @returns 用户请求削弱动态效果。
 */
export const isPrefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type StyleProperties = string & keyof FilterValueType<CSSStyleDeclaration, string>;
type Keyframe = Partial<Override<Record<StyleProperties, Numberish>, { offset: number }>>;
type Keyframes = Keyframe[];
type DimensionAxis = "height" | "width" | "both";
type MaybePromise<T> = T | Promise<T>;

type AnimateSizeOptions = Partial<{
	/** 显式指定初始高度（可选）。 */
	startHeight: number;
	/** 显式指定结束高度（可选）。 */
	endHeight: number;
	/** 显式指定初始宽度（可选）。 */
	startWidth: number;
	/** 显式指定结束宽度（可选）。 */
	endWidth: number;
	/** 动画时间。 */
	duration: number;
	/** 动画运动曲线。默认为：平滑缓出。 */
	easing: string;
	/** 显式指定需要动画的是哪个方向。 */
	specified: DimensionAxis;
	/** 指定**不**需要动画调整哪个方向的内/外边距值。 */
	withoutAdjustPadding: DimensionAxis;
	/** 在改变回调函数后自动增加等待下一帧。 */
	nextTick: boolean;
	/** 获取最终的元素尺寸。 */
	getSize: TwoD | Ref<TwoD | undefined>;
	/** 获取最终的元素矩形。 */
	getRect: Ref<DOMRect | undefined>;
	/** 显式指定初始样式（可选）。 */
	startStyle: Keyframe;
	/** 显式指定结束样式（可选）。 */
	endStyle: Keyframe;
	/** 初始从反向滑入界面。 */
	startReverseSlideIn: boolean;
	/** 结束从反向滑入界面。 */
	endReverseSlideIn: boolean;
	/** 元素的**唯一**子元素初始位移。 */
	startChildTranslate: Numberish;
	/** 元素的**唯一**子元素结束位移。 */
	endChildTranslate: Numberish;
	/** 是否抽掉动画的第一帧以解决可能存在的动画故障？仅在有子元素时生效。 */
	removeGlitchFrame: boolean;
	/** 动画播放的同时附加其它动画，并使用与之相同的时长与缓动值。 */
	attachAnimations: [Element, Keyframes][] | false;
	/** 不要 `overflow: hidden;`？ */
	noCropping: boolean;
}>;

/**
 * 当宽/高度值设为 auto 时的动画宽/高度的高级钩子生成器函数。
 * @param element - HTML DOM 元素。
 * @returns 最终返回动画异步承诺的生成器函数。
 */
export async function* animateSizeGenerator(
	element: MaybeRef<Element | undefined>,
	{
		startHeight,
		endHeight,
		startWidth,
		endWidth,
		duration = 250,
		easing = eases.easeOutSmooth,
		specified = "both",
		withoutAdjustPadding,
		nextTick: awaitNextTick = true,
		getSize,
		getRect,
		startStyle = {},
		endStyle = {},
		startReverseSlideIn,
		endReverseSlideIn,
		startChildTranslate,
		endChildTranslate,
		removeGlitchFrame,
		attachAnimations,
		noCropping = false,
	}: AnimateSizeOptions = {},
): AsyncGenerator<void, Animation | void, boolean> {
	element = toValue(element);
	if (!element) return;
	if (isPrefersReducedMotion()) duration = 0;
	startHeight ??= element.clientHeight;
	startWidth ??= element.clientWidth;
	const hasChangeFunc = yield;
	if (hasChangeFunc && awaitNextTick) await nextTick();
	endHeight ??= element.clientHeight;
	endWidth ??= element.clientWidth;
	if (getSize)
		if (getSize instanceof Array) [getSize[0], getSize[1]] = [endWidth, endHeight];
		else getSize.value = [endWidth, endHeight];
	if (getRect)
		getRect.value = element.getBoundingClientRect();
	let isHeightChanged = specified === "height" || specified === "both",
		isWidthChanged = specified === "width" || specified === "both";
	if (startHeight === endHeight) isHeightChanged = false; // 不用动了。
	if (startWidth === endWidth) isWidthChanged = false;
	if (!isHeightChanged && !isWidthChanged) return;
	const keyframes = [{}, {}] as Keyframes;
	if (isHeightChanged) [keyframes[0].height, keyframes[1].height] = [startHeight + "px", endHeight + "px"];
	if (isWidthChanged) [keyframes[0].width, keyframes[1].width] = [startWidth + "px", endWidth + "px"];
	let setYPaddingIndex: number | undefined, setXPaddingIndex: number | undefined;
	if (startHeight === 0) setYPaddingIndex = 0;
	if (endHeight === 0) setYPaddingIndex = 1;
	if (startWidth === 0) setXPaddingIndex = 0;
	if (endWidth === 0) setXPaddingIndex = 1;
	const setXPadding = withoutAdjustPadding === undefined || withoutAdjustPadding === "height",
		setYPadding = withoutAdjustPadding === undefined || withoutAdjustPadding === "width";
	if (setXPadding && isHeightChanged && setYPaddingIndex !== undefined)
		Object.assign(keyframes[setYPaddingIndex], { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 });
	if (setYPadding && isWidthChanged && setXPaddingIndex !== undefined)
		Object.assign(keyframes[setXPaddingIndex], { paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0 });
	const setTranslate = (pxes: number[]) => pxes.map(i => i + "px").join(" ");
	if (startReverseSlideIn)
		keyframes[0].translate = setTranslate([isWidthChanged ? endWidth : 0, isHeightChanged ? endHeight : 0]);
	if (endReverseSlideIn)
		keyframes[1].translate = setTranslate([isWidthChanged ? startWidth : 0, isHeightChanged ? startHeight : 0]);
	Object.assign(keyframes[0], startStyle);
	Object.assign(keyframes[1], endStyle);
	const animationOptions = { duration, easing };
	const htmlElement = element as HTMLElement;
	if (!noCropping) htmlElement.style.overflow = "hidden";
	const result = element.animate(keyframes, animationOptions);
	if (!noCropping) result.addEventListener("finish", () => htmlElement.style.removeProperty("overflow"));
	if (startChildTranslate || endChildTranslate || attachAnimations) {
		const onlyChild = element.children[0]; // 只取唯一一个子元素。
		if (onlyChild && element instanceof HTMLElement && removeGlitchFrame) {
			element.hidden = true;
			await nextAnimationTick();
			element.hidden = false;
		}
		if (onlyChild && (startChildTranslate || endChildTranslate)) onlyChild.animate([
			startChildTranslate ? { translate: startChildTranslate } : {},
			endChildTranslate ? { translate: endChildTranslate } : {},
		], animationOptions);
		if (attachAnimations) attachAnimations.forEach(group => group[0]?.animate(group[1], animationOptions));
	}
	return result.finished;
}

/**
 * 当宽/高度值设为 auto 时的动画宽/高度。
 * @param element - HTML DOM 元素。
 * @param changeFunc - 使宽/高度将会改变的回调函数。
 * @param options - 配置选项。
 * @returns 动画异步承诺。
 */
export async function animateSize(
	element: MaybeRef<Element | undefined>,
	changeFunc: (() => MaybePromise<void | unknown>) | undefined | null,
	options: AnimateSizeOptions = {},
): Promise<Animation | void> {
	const gen = animateSizeGenerator(element, options);
	gen.next();
	if (changeFunc) await changeFunc();
	const animation = await gen.next(!!changeFunc);
	return animation.value;
}

type SameOrDifferent<T> = T | undefined | [T | undefined, T | undefined];
type TransitionHook = (el: Element, done: () => void) => Promise<void>;

/**
 * `animateSize` 函数的简化版，适用于更为简单的动画。
 * @param specified - 显式指定需要动画的是哪个方向。默认为高度动画。
 * @param duration - 指定动画时间。
 * @param easing - 指定动画缓动曲线。
 * @returns 返回 `onEnter` 和 `onLeave` 两个函数。
 */
export function simpleAnimateSize(specified: "width" | "height" = "height", duration?: SameOrDifferent<number>, easing?: SameOrDifferent<string>) {
	type Options = Parameters<typeof animateSize>[2];
	let enter: Options, leave: Options;
	if (specified === "width") {
		enter = { startWidth: 0 };
		leave = { endWidth: 0 };
	} else {
		enter = { startHeight: 0 };
		leave = { endHeight: 0 };
	}
	duration = duration instanceof Array ? duration : [duration, duration];
	easing = easing instanceof Array ? easing : [easing, easing];
	enter.duration = duration[0];
	leave.duration = duration[1];
	enter.easing = easing[0];
	leave.easing = easing[1];

	const onEnter: TransitionHook = async (el, done) => {
		await animateSize(el, null, enter);
		done();
	};
	const onLeave: TransitionHook = async (el, done) => {
		await animateSize(el, null, leave);
		done();
	};

	return [onEnter, onLeave];
}

export const STOP_TRANSITION_ID = "stop-transition";

/**
 * 为整个页面添加视图过渡动画。
 * @param changeFunc - 使页面变化的回调函数。
 * @param keyframes - 动画关键帧。
 * @param options - 动画选项。
 * @returns 在动画播放完成之后可执行析构函数。
 */
export async function startColorViewTransition(changeFunc: () => MaybePromise<void>, keyframes: Keyframe[] | PropertyIndexedKeyframes, options: KeyframeAnimationOptions = {}) {
	if (!document.startViewTransition) {
		await changeFunc();
		return;
	}

	const style = document.createElement("style");
	style.id = STOP_TRANSITION_ID;
	style.textContent = `
		*,
		*::before,
		*::after {
			-webkit-transition: none !important;
			-moz-transition: none !important;
			-o-transition: none !important;
			-ms-transition: none !important;
			transition: none !important;
		}

		::view-transition-old(root),
		::view-transition-new(root) {
			mix-blend-mode: normal;
			transition: none !important;
			animation: none !important;
		}

		::view-transition-old(*),
		::view-transition-new(*),
		::view-transition-old(*::before),
		::view-transition-new(*::after) {
			transition: none !important;
		}
	`;
	document.head.appendChild(style);

	options.duration ??= 300;
	options.easing ??= eases.easeInOutSmooth;
	options.pseudoElement ??= "::view-transition-new(root)";

	const transition = document.startViewTransition(changeFunc);
	await transition.ready;

	const animation = document.documentElement.animate(keyframes, options);
	await animation.finished;
	document.head.removeChild(style);
}
