// 已禁用，请使用 100dvh 代替之。

import delay from "../../utils/delay";

export default defineNuxtPlugin(nuxt => {
	nuxt.hook("app:beforeMount", () => {
		const declareInnerHeight = () => {
			const innerHeight = window.innerHeight;
			document.documentElement.style.setProperty("--inner-height",
				`min(${innerHeight}px, 100vh)`);
			return innerHeight;
		};
		declareInnerHeight();
		window.addEventListener("load", declareInnerHeight);
		window.addEventListener("resize", async () => {
			let height = NaN, prevHeight = NaN;
			do {
				prevHeight = height;
				height = declareInnerHeight();
				await delay(100);
			} while (height !== prevHeight);
		});
	});
});
