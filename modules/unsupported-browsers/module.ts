import { addServerHandler, addTemplate, defineNuxtModule } from "@nuxt/kit";
import { PREFERENTIAL_ROUTE, PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import { compileTypeScript, createReadFileResolver, minifyHtml, minifyJavaScript, useNuxtHead, bundleJavaScript } from "../shared/encode";
import { IE_PAGE_HTML_FILE, IE_PAGE_SCRIPT_FILE_TS, IE_PAGE_SCRIPT_FILE_JS, UNSUPPORTED_ROUTE } from "./constants";

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { readFile, resolve } = createReadFileResolver(__dirname);

		let iePageHtml = await readFile(IE_PAGE_HTML_FILE);
		iePageHtml = await minifyHtml(iePageHtml);
		addTemplate({
			filename: PREFERENTIAL_TEMPLATE_PATH + IE_PAGE_HTML_FILE,
			write: true,
			getContents: () => iePageHtml,
		});

		let iePageScript = await bundleJavaScript(resolve(IE_PAGE_SCRIPT_FILE_TS));
		iePageScript = compileTypeScript(iePageScript, "ES5");
		iePageScript = await minifyJavaScript(iePageScript);
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
