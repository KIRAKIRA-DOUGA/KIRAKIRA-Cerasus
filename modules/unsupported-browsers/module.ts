import { readFile } from "node:fs/promises";
import { addServerHandler, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { bundleJavaScript, compileTypeScript, minifyHtml, minifyJavaScript } from "js-build-utils";
import { PREFERENTIAL_ROUTE, PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import { useNuxtHead } from "../shared/encode";
import { IE_PAGE_HTML_FILE, IE_PAGE_SCRIPT_FILE_JS, IE_PAGE_SCRIPT_FILE_TS, UNSUPPORTED_ROUTE } from "./constants";

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.dirname);

		let iePageHtml = await readFile(resolve(IE_PAGE_HTML_FILE), "utf-8");
		iePageHtml = await minifyHtml(iePageHtml, { html: "terser", js: "oxc", css: "lightningcss" });
		addTemplate({
			filename: PREFERENTIAL_TEMPLATE_PATH + IE_PAGE_HTML_FILE,
			write: true,
			getContents: () => iePageHtml,
		});

		let iePageScript = await bundleJavaScript(resolve(IE_PAGE_SCRIPT_FILE_TS), "rolldown");
		iePageScript = compileTypeScript(iePageScript, "ES5");
		iePageScript = minifyJavaScript(iePageScript, "oxc", "classic");
		addTemplate({
			filename: PREFERENTIAL_TEMPLATE_PATH + IE_PAGE_SCRIPT_FILE_JS,
			write: true,
			getContents: () => iePageScript,
		});

		const IE_PAGE_SCRIPT_PATH = PREFERENTIAL_ROUTE + IE_PAGE_SCRIPT_FILE_JS;
		const head = useNuxtHead(nuxt);
		head.script ??= [];
		head.script.push({ src: IE_PAGE_SCRIPT_PATH });

		addServerHandler({
			route: UNSUPPORTED_ROUTE,
			handler: resolve("route"),
		});
	},
});
