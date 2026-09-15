/*
 * 使用 `v-ripple`，为元素创建类 Material Design 的水波纹效果。
 */

import ripplePlugin from "vue-directive-ripple";

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(ripplePlugin, {
		accelerateOnRelease: false,
		materialDesignVersion: 2,
	});
});
