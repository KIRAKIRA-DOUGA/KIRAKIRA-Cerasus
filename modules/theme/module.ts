import { addImports, addPlugin, defineNuxtModule } from "@nuxt/kit";
import { resolve } from "path";

export function getFunctionBody(func: Function) {
	const str = func.toString();
	const leftBraceIndex = str.indexOf("{");
	return str.slice(leftBraceIndex + 1, -1);
}

export default defineNuxtModule({
	setup(_options, nuxt) {
		addPlugin(resolve(__dirname, "plugin"));
		addImports({ name: "Theme", as: "Theme", from: resolve(__dirname, "composables").replaceAll("\\", "/") });
		nuxt.hook("nitro:config", config => {
			config.plugins ??= [];
			config.plugins.push(resolve(__dirname, "nitro-plugin"));
		});
	},
});
