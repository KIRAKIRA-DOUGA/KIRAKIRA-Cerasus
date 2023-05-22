import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { dirname } from "path";
import { PREFERENTIAL_BASE_URL, PREFERENTIAL_ROUTE, TEMPLATE_PATH } from "../shared/constants";
import script from "./script";

const TEMPLATE_NAME = "theme.script.js";
export const SCRIPT_ROUTE = PREFERENTIAL_ROUTE + TEMPLATE_NAME;

/**
 * 获取函数体内容。
 * @param func - 函数。
 * @param compressed - 是否压缩代码？
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
	setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.url);
		addPlugin(resolve(__dirname, "plugin"));
		addImports({ name: "Theme", as: "Theme", from: resolve(__dirname, "composables").replaceAll("\\", "/") });
		const template = addTemplate({
			filename: TEMPLATE_PATH + TEMPLATE_NAME,
			write: true,
			getContents() {
				return `(function (autoCall) {${getFunctionBody(script, true)}})();`;
			},
		});
		// 参考自：https://github.com/nuxt/nuxt/discussions/17691
		nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
		nuxt.options.nitro.publicAssets.push({
			baseURL: PREFERENTIAL_BASE_URL,
			dir: dirname(template.dst),
		});
		nuxt.hook("nitro:config", nitro => {
			nitro.plugins ??= [];
			nitro.plugins.push(resolve("nitro-plugin.ts"));
		});
	},
});
