import { dirname } from "path";
import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { PREFERENTIAL_BASE_URL, PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import { minifyJavaScript } from "../shared/encode";
import { THEME_COOKIE_BANDER_SCRIPT_TEMPLATE_NAME } from "./constants";
import { cookieBinding } from "./theme-cookie-binding";

/**
 * 将传入的函数的函数体部分序列化为一个字面量字符串。
 * @param func - 函数。
 * @param compressed - 是否丑化（压缩）代码？
 * @returns 函数的内容字符串。
 */
export function getFunctionBody(func: Function, compressed: boolean) {
	const str = func.toString();
	const leftBraceIndex = str.indexOf("{");
	const result = str.slice(leftBraceIndex + 1, -1);
	if (compressed) return result.replaceAll(/\n\s*/g, " ");
	else return result;
}

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.url);

		// 主题同步相关的全局导出
		addPlugin(resolve("plugin"));
		const composablesRoute = resolve("composables");
		addImports({ name: "cookieBaker", as: "cookieBaker", from: composablesRoute });
		addImports({ name: "saveUserSetting2BrowserCookieStore", as: "saveUserSetting2BrowserCookieStore", from: composablesRoute });
		addImports({ name: "useKiraCookie", as: "useKiraCookie", from: composablesRoute });
		addImports({ name: "SyncUserSettings", as: "SyncUserSettings", from: composablesRoute });
		const cookieBindingRoute = resolve("theme-cookie-binding");
		addImports({ name: "DEFAULT_COOKIE_OPTION", as: "DEFAULT_COOKIE_OPTION", from: cookieBindingRoute });
		addImports({ name: "THEME_ENV", as: "THEME_ENV", from: cookieBindingRoute });
		addImports({ name: "COOKIE_KEY", as: "COOKIE_KEY", from: cookieBindingRoute });
		addImports({ name: "cookieBinding", as: "cookieBinding", from: cookieBindingRoute });

		let cookieBanderContent = `(function (autoCall = true) {${getFunctionBody(cookieBinding, false)}})();`;
		cookieBanderContent = await minifyJavaScript(cookieBanderContent);
		const cookieBanderTemplate = addTemplate({
			filename: PREFERENTIAL_TEMPLATE_PATH + THEME_COOKIE_BANDER_SCRIPT_TEMPLATE_NAME,
			write: true,
			getContents: () => cookieBanderContent,
		});
		// 参考自：https://github.com/nuxt/nuxt/discussions/17691
		nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
		nuxt.options.nitro.publicAssets.push({
			baseURL: PREFERENTIAL_BASE_URL,
			dir: dirname(cookieBanderTemplate.dst),
		});

		nuxt.hook("nitro:config", nitro => {
			nitro.plugins ??= [];
			nitro.plugins.push(resolve("nitro-plugin.ts"));
		});
	},
});
