import { addServerHandler, addTemplate, defineNuxtModule } from "@nuxt/kit";
import { PREFERENTIAL_ROUTE, PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import { compileTypeScript, createReadFileResolver, minifyHtml, minifyJavaScript, useNuxtHead, wrapIife } from "../shared/encode";

export const IE_PAGE_HTML_FILE = "601.html";
const IE_PAGE_SCRIPT_FILE = "jump-if-ie";
const IE_PAGE_SCRIPT_FILE_TS = IE_PAGE_SCRIPT_FILE + ".ts", IE_PAGE_SCRIPT_FILE_JS = IE_PAGE_SCRIPT_FILE + ".js";

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { readFile, resolve } = createReadFileResolver(__dirname);

		let iePageHtml = await readFile(IE_PAGE_HTML_FILE);
		iePageHtml = await minifyHtml(iePageHtml);
		nuxt.options.runtimeConfig.iePageHtml = iePageHtml; // XXX 该方式不优雅，等待更合适的方法。

		let iePageScript = await readFile(IE_PAGE_SCRIPT_FILE_TS);
		iePageScript = compileTypeScript(iePageScript, "ES5");
		iePageScript = wrapIife(iePageScript);
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
			route: "/unsupported",
			handler: resolve("route"),
		});
	},
});
