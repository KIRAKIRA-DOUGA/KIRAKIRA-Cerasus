import { addServerHandler, addTemplate, defineNuxtModule } from "@nuxt/kit";
import { PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import { compileSassFile, createReadFileResolver, minifyHtml } from "../shared/encode";
import { NOSCRIPT_HTML_FILE, NOSCRIPT_SCSS_FILE, NOSCRIPT_ROUTE } from "./constants";

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { readFile, resolve } = createReadFileResolver(__dirname);

		let noscriptHtml = await readFile(NOSCRIPT_HTML_FILE);
		const noscriptStyle = compileSassFile(__dirname, NOSCRIPT_SCSS_FILE);
		noscriptHtml = noscriptHtml.replace(/(?=\s*<\/head>)/, `\n<style>\n${noscriptStyle}\n</style>`);
		noscriptHtml = await minifyHtml(noscriptHtml);
		addTemplate({
			filename: PREFERENTIAL_TEMPLATE_PATH + NOSCRIPT_HTML_FILE,
			write: true,
			getContents: () => noscriptHtml,
		});

		nuxt.hook("nitro:config", nitro => {
			nitro.plugins ??= [];
			nitro.plugins.push(resolve("nitro-plugin.ts"));
		});

		addServerHandler({
			route: NOSCRIPT_ROUTE,
			handler: resolve("route"),
		});
	},
});
