/*!
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
	let isInitedPointerUp = false;
	type D = Directive<HTMLElement, boolean>;

	nuxt.vueApp.directive("ripple", {
		mounted(element, binding) {
			element.classList.add(rippleClass);
			element.addEventListener("pointerdown", e => {
				if (binding.value === false) return;
				const rect = element.getBoundingClientRect();
				if (!rect) return;
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
				element.prepend(circle);
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
		updated(element) {
			element.classList.add(rippleClass);
		},
	} as D);
});
