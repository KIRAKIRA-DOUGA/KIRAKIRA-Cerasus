/*
 * 使用 `v-ripple`，为元素创建类 Material Design 的水波纹效果。
 */

import "styles/elements/ripple.scss";

/**
 * 获取点到矩形四个角的最大距离，即水波纹最大半径。
 * @param rect - DOM 矩形边缘。
 * @param e - 鼠标事件。
 * @returns 水波纹最大半径。
 */
function getMaxRadius(rect: DOMRect, e: MouseEvent) {
	const pointer = new Point(e.clientX, e.clientY);
	const leftTop = new Point(rect.left, rect.top);
	const rightTop = new Point(rect.right, rect.top);
	const rightBottom = new Point(rect.right, rect.bottom);
	const leftBottom = new Point(rect.left, rect.bottom);
	return Math.max(
		pointer.distance(leftTop),
		pointer.distance(rightTop),
		pointer.distance(rightBottom),
		pointer.distance(leftBottom),
	);
}

// 水波纹效果。
export default defineNuxtPlugin(nuxt => {
	const rippleClass = "ripple-button";
	const circleClass = "ripple-circle";
	const spreadRippleId = "spread-ripple";
	const wrapperClass = "ripple-wrapper";
	const cutClass = "ripple-button-cut";
	let isInitedPointerUp = false;
	type D = Directive<HTMLElement, boolean | "overlay">;
	type EffectHook = DirectiveEffectHook<D>;
	
	const updated: EffectHook = (element, binding) => {
		const isOverlay = binding.arg === "overlay";
		// 当指定参数为 overlay 时，不会给元素加 overflow: hidden，以保证元素内的子元素可以正常超出该元素范围。
		// 但是如果给所有水波纹默认使用此模式，在另外一些情况下又会出现其它异常，如圆角等的问题。
		element.classList.add(rippleClass);
		if (!isOverlay) element.classList.add(cutClass);
	};

	nuxt.vueApp.directive("ripple", {
		updated,
		mounted(element, binding) {
			const isOverlay = binding.arg === "overlay";
			updated(element, binding);
			element.addEventListener("pointerdown", e => {
				if (binding.value === false) return;
				const rect = element.getBoundingClientRect();
				if (!rect) return;
				let wrapper = element;
				if (isOverlay) {
					wrapper = [...element.children].find(el => el.classList.contains(wrapperClass)) as HTMLElement;
					if (!wrapper) {
						wrapper = document.createElement("div");
						wrapper.classList.add(wrapperClass);
						element.prepend(wrapper);
					}
				}
				const circleRadius = getMaxRadius(rect, e) + 1; // + 1 用于边缘问题。
				let pointerX = e.clientX - rect.x,
					pointerY = e.clientY - rect.y;
				pointerX -= circleRadius;
				pointerY -= circleRadius;
				const circle = document.createElement("div");
				circle.classList.add(circleClass);
				circle.style.width = circleRadius * 2 + "px";
				circle.style.height = circleRadius * 2 + "px";
				circle.style.left = pointerX + "px";
				circle.style.top = pointerY + "px";
				wrapper.prepend(circle);
				circle.animate([
					{ scale: 0 },
					{ scale: 1 },
				], {
					duration: 1000,
					easing: eases.easeOutMax,
					id: spreadRippleId,
				});
			});
			if (isInitedPointerUp) return;
			isInitedPointerUp = true;
			addEventListeners(document, "pointerup", "pointercancel", () => {
				const FADE_TIME = 500;
				const IS_FADING_CLASS = "is-fading";
				for (const circle of document.getElementsByClassName(circleClass)) {
					if (circle.classList.contains(IS_FADING_CLASS)) continue;
					const spreadRipple = circle.getAnimations().find(animation => animation.id === spreadRippleId);
					if (spreadRipple)
						spreadRipple.updatePlaybackRate(3);
					circle.classList.add(IS_FADING_CLASS);
					circle.animate([
						{ opacity: 1 },
						{ opacity: 0 },
					], {
						duration: FADE_TIME,
						easing: eases.easeOutMax,
					}).finished.then(() => circle.remove());
				}
			});
		},
	} as D);
});
