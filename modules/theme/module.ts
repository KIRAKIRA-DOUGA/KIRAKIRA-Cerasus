import { addImports, addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit";

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
		nuxt.hook("nitro:config", nitro => {
			nitro.plugins ??= [];
			nitro.plugins.push(resolve("nitro-plugin.ts"));
		});
	},
});
