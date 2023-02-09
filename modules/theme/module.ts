import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import script from "./script";

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
		addTemplate({
			filename: "theme.script.js",
			write: true,
			getContents() {
				return `(function (autoCall) {${getFunctionBody(script, true)}})();`;
			},
		});
		nuxt.hook("nitro:config", nitro => {
			nitro.plugins ??= [];
			nitro.plugins.push(resolve("nitro-plugin.ts"));
		});
	},
});
