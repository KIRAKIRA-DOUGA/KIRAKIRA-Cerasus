/**
 * 初始化需要在开发环境下控制台声明的全局变量。
 */
export function loadDevGlobal() {
	if (environment.development && environment.client) {
		const global = globalThis as Record<string, unknown>;

		global.setTheme = function (scheme: string, palette: string) {
			const html = document.documentElement;
			if (palette) html.className = palette;
			if (scheme) html.classList[scheme === "dark" ? "add" : "remove"]("dark");
		};

		global.setLang = function (lang: string) {
			document.documentElement.lang = lang;
		};

		global.findCss = function (component: string) {
			return document.head.querySelector(`style[data-vite-dev-id*="${component}.vue" i]`) ??
				document.head.querySelector(`style[data-vite-dev-id*="${component}" i]`);
		};
	}
}
