export default defineNuxtPlugin(nuxt => {
	nuxt.hook("app:mounted", () => {
		// 监听系统主题的 change 事件，如果系统主题变更，也要重新绑定样式
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", cookieBinding);
	});
});
