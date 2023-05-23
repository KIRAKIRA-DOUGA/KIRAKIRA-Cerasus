/*!
 * 使用 `v-i`，为元素样式添加 `--i` 自定义属性，用于添加延时出现的动画。
 */

export default defineNuxtPlugin(nuxt => {
	type D = Directive<HTMLElement, number>;
	const updated: DirectiveEffectHook<D> = (element, binding) =>
		element.style.setProperty("--i", String(binding.value));
	nuxt.vueApp.directive("i", {
		mounted: updated,
		updated,
	} as D);
});
