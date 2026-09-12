import { readFile } from "node:fs/promises";
import { join } from "node:path/posix";
import { addServerHandler, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { compileSassFile, minifyHtml } from "js-build-utils";
import { PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import { NOSCRIPT_HTML_FILE, NOSCRIPT_ROUTE, NOSCRIPT_SCSS_FILE, REFRESH_ICON, REFRESH_ICON_ROUTE } from "./constants";

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.dirname);

		let noscriptHtml = await readFile(resolve(NOSCRIPT_HTML_FILE), "utf-8");
		const noscriptStyle = compileSassFile(__dirname, NOSCRIPT_SCSS_FILE);
		noscriptHtml = noscriptHtml.replace(/(?=\s*<\/head>)/, `\n<style>\n${noscriptStyle}\n</style>`);
		noscriptHtml = await minifyHtml(noscriptHtml, { html: "terser", js: "oxc", css: "lightningcss" });
		addTemplate({
			filename: join(PREFERENTIAL_TEMPLATE_PATH, NOSCRIPT_HTML_FILE),
			write: true,
			getContents: () => noscriptHtml,
		});

		let refreshIcon = await readFile(resolve(REFRESH_ICON), "utf-8");
		refreshIcon = await minifyHtml(refreshIcon, { html: "terser", js: "oxc", css: "lightningcss" });
		addTemplate({
			filename: join(PREFERENTIAL_TEMPLATE_PATH, REFRESH_ICON_ROUTE),
			write: true,
			getContents: () => refreshIcon,
		});

		nuxt.hook("nitro:config", nitro => {
			nitro.plugins ??= [];
			nitro.plugins.push(resolve("nitro-plugin.ts"));
		});

		addServerHandler({
			route: NOSCRIPT_ROUTE,
			handler: resolve("route"),
		});

		addServerHandler({
			route: "/issues",
			handler: resolve("route-issues"),
		});
	},
});
