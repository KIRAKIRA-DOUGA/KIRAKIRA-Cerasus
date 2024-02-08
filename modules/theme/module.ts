import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { dirname } from "path";
import { PREFERENTIAL_BASE_URL, PREFERENTIAL_ROUTE, PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import { minifyJavaScript } from "../shared/encode";
import { cookieBander } from "./cookieBinding";

const COOKIE_BANDER_SCRIPT_TEMPLATE_NAME = "cookie-binding.js";
export const COOKIE_BANDER_SCRIPT_ROUTE = PREFERENTIAL_ROUTE + COOKIE_BANDER_SCRIPT_TEMPLATE_NAME;

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

		addPlugin(resolve("plugin"));
		addImports({ name: "Theme", as: "Theme", from: resolve("composables")/* .replaceAll("\\", "/") */ });

		let cookieBanderContent = `(function (autoCall = true) {${getFunctionBody(cookieBander, false)}})();`;
		cookieBanderContent = await minifyJavaScript(cookieBanderContent);
		const cookieBanderTemplate = addTemplate({
			filename: PREFERENTIAL_TEMPLATE_PATH + COOKIE_BANDER_SCRIPT_TEMPLATE_NAME,
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
