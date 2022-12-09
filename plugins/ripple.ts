/* eslint-disable prefer-template */

import styles from "styles/ripple.module.scss";

class Point {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	distance(point: Point): number {
		return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
	}
}

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

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.directive("ripple", {
		mounted(element: HTMLElement) {
			const rippleClass = styles.rippleButton;
			const circleClass = styles.rippleCircle;

			element.classList.add(rippleClass);
			element.addEventListener("mousedown", e => {
				const rect = element.getClientRects()[0];
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
					{ transform: "scale(0)" },
					{ transform: "scale(1)" },
				], {
					duration: 1000,
					easing: eases.easeOutMax,
				});

				const mouseUp = () => {
					document.removeEventListener("mouseup", mouseUp);
					const FADE_TIME = 500;
					const IS_FADING_CLASS = "is-fading";
					for (const circle of document.getElementsByClassName(circleClass)) {
						if (circle.classList.contains(IS_FADING_CLASS)) return;
						circle.classList.add(IS_FADING_CLASS);
						circle.animate([
							{ opacity: 1 },
							{ opacity: 0 },
						], {
							duration: FADE_TIME,
							easing: eases.easeOutMax,
						}).finished.then(() => circle.remove());
					}
				};
				document.addEventListener("mouseup", mouseUp);
			});
		},
	});
});
