/**
 * 使用 `v-i`，为元素样式添加 `--i` 自定义属性，用于添加延时出现的动画。
 */

import { DirectiveBinding } from "nuxt/dist/app/compat/vue-demi";

export default defineNuxtPlugin(nuxtApp => {
	function updated(element: HTMLElement, binding: DirectiveBinding<number>) {
		element.style.setProperty("--i", String(binding.value));
	}
	nuxtApp.vueApp.directive("i", {
		mounted: updated,
		updated,
	});
});
